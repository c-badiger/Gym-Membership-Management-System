const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to validate mobile number
const validateMobile = (mobile) => {
    return /^\d{10}$/.test(mobile);
};

// Admin/Staff Login
const login = async (req, res) => {
    const loginId = req.body.loginId || req.body.email;
    const { password } = req.body;

    try {
        const [users] = await db.execute('SELECT * FROM Users WHERE email = ? OR name = ?', [loginId, loginId]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'supersecretgymkey123',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin Signup
const signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const [existing] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, role || 'admin']);
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Member Login (Phone + Password)
const memberLogin = async (req, res) => {
    const { login, password } = req.body; // login will be phone or name

    try {
        const [members] = await db.execute('SELECT * FROM Members WHERE phone = ? OR name = ?', [login, login]);

        if (members.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const member = members[0];
        const isMatch = await bcrypt.compare(password, member.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: member.id, name: member.name, role: 'member' },
            process.env.JWT_SECRET || 'supersecretgymkey123',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: member.id,
                name: member.name,
                role: 'member'
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Send OTP
const sendOtp = async (req, res) => {
    const phone = req.body.phone || req.body.mobile_number;
    const { type } = req.body;

    if (!phone || !validateMobile(phone)) {
        return res.status(400).json({ message: 'Phone must be exactly 10 digits' });
    }

    try {
        const [members] = await db.execute('SELECT * FROM Members WHERE phone = ?', [phone]);
        
        if (type === 'reset' && members.length === 0) {
            return res.status(404).json({ message: 'Phone not registered' });
        }
        
        if (type === 'register' && members.length > 0) {
            return res.status(400).json({ message: 'Phone already registered' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await db.execute('INSERT INTO OTP_TABLE (phone, otp, expiry_time) VALUES (?, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 5 MINUTE))', [phone, otp]);

        // Simulated OTP send
        console.log(`[SIMULATION] OTP for ${phone} is: ${otp}`);
        
        res.json({ message: 'OTP generated successfully', simulatedOtp: otp });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify OTP (For Login)
const verifyOtp = async (req, res) => {
    const phone = req.body.phone || req.body.mobile_number;
    const { otp } = req.body;

    if (!phone || !validateMobile(phone)) {
        return res.status(400).json({ message: 'Phone must be exactly 10 digits' });
    }

    try {
        const [records] = await db.execute('SELECT * FROM OTP_TABLE WHERE phone = ? ORDER BY created_at DESC LIMIT 1', [phone]);
        if (records.length === 0) return res.status(400).json({ message: 'No OTP found' });

        const record = records[0];
        if (new Date() > new Date(record.expiry_time)) return res.status(400).json({ message: 'OTP expired' });
        if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

        // OTP Valid - Login Member
        const [members] = await db.execute('SELECT * FROM Members WHERE phone = ?', [phone]);
        const member = members[0];

        const token = jwt.sign(
            { id: member.id, name: member.name, role: 'member' },
            process.env.JWT_SECRET || 'supersecretgymkey123',
            { expiresIn: '1d' }
        );

        res.json({
            message: 'OTP Verified, Login Successful',
            token,
            user: { id: member.id, name: member.name, role: 'member' }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset Password (Using OTP)
const resetPassword = async (req, res) => {
    const phone = req.body.phone || req.body.mobile_number;
    const { otp, newPassword } = req.body;

    if (!phone || !validateMobile(phone)) {
        return res.status(400).json({ message: 'Phone must be exactly 10 digits' });
    }

    try {
        const [records] = await db.execute('SELECT * FROM OTP_TABLE WHERE phone = ? ORDER BY created_at DESC LIMIT 1', [phone]);
        if (records.length === 0) return res.status(400).json({ message: 'No OTP found' });

        const record = records[0];
        if (new Date() > new Date(record.expiry_time)) return res.status(400).json({ message: 'OTP expired' });
        if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.execute('UPDATE Members SET password = ? WHERE phone = ?', [hashedPassword, phone]);

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Member Register with OTP
const memberRegister = async (req, res) => {
    const phone = req.body.phone || req.body.mobile_number;
    const { name, email, password, otp } = req.body;

    if (!phone || !validateMobile(phone)) {
        return res.status(400).json({ message: 'Phone must be exactly 10 digits' });
    }

    try {
        // Verify OTP
        const [records] = await db.execute('SELECT * FROM OTP_TABLE WHERE phone = ? ORDER BY created_at DESC LIMIT 1', [phone]);
        if (records.length === 0) return res.status(400).json({ message: 'No OTP found' });

        const record = records[0];
        if (new Date() > new Date(record.expiry_time)) return res.status(400).json({ message: 'OTP expired' });
        if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

        // Check duplicates
        const [existing] = await db.execute('SELECT * FROM Members WHERE phone = ?', [phone]);
        if (existing.length > 0) return res.status(400).json({ message: 'Phone already registered' });

        // Insert Member
        const hashedPassword = await bcrypt.hash(password, 10);
        const join_date = new Date().toISOString().split('T')[0];
        
        await db.execute(
            'INSERT INTO Members (name, email, phone, password, join_date, status) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email || null, phone, hashedPassword, join_date, 'Active']
        );

        res.status(201).json({ message: 'Registration successful! You can now login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { login, signup, sendOtp, verifyOtp, resetPassword, memberLogin, memberRegister };
