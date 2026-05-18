const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Helper to validate mobile number
const validateMobile = (mobile) => {
    return /^\d{10}$/.test(mobile);
};

// Get all members with payment status, search, and filter
const getMembers = async (req, res) => {
    try {
        const { search, payment_status, status } = req.query;
        let query = `
            SELECT m.id, m.name, m.email, m.phone, m.join_date, m.plan, m.status,
                   t.name as trainer_name, w.title as workout_title, d.title as diet_title,
                   CASE WHEN MAX(p.id) IS NOT NULL THEN 'PAID' ELSE 'UNPAID' END AS payment_status
            FROM Members m
            LEFT JOIN Payments p ON m.id = p.member_id AND p.status = 'paid'
            LEFT JOIN Trainers t ON m.trainer_id = t.id
            LEFT JOIN Workout_Plans w ON m.workout_plan_id = w.id
            LEFT JOIN Diet_Plans d ON m.diet_plan_id = d.id
        `;
        let conditions = [];
        let params = [];

        if (search) {
            conditions.push('(m.name LIKE ? OR m.phone LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }
        if (status) {
            conditions.push('m.status = ?');
            params.push(status);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' GROUP BY m.id';

        if (payment_status) {
            query += ` HAVING payment_status = ?`;
            params.push(payment_status.toUpperCase());
        }

        query += ' ORDER BY m.created_at DESC';

        const [members] = await db.query(query, params);
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a member
const addMember = async (req, res) => {
    const { name, email, phone, password, join_date, plan, status } = req.body;
    
    if (!phone || !validateMobile(phone)) {
        return res.status(400).json({ message: 'Phone must be exactly 10 digits' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password || 'member123', 10);
        
        const [result] = await db.execute(
            'INSERT INTO Members (name, email, phone, password, join_date, plan, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email || null, phone, hashedPassword, join_date, plan || null, status || 'Active']
        );
        res.status(201).json({ id: result.insertId, name, email, phone, join_date, plan, status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a member
const updateMember = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, plan, status } = req.body;

    if (phone && !validateMobile(phone)) {
        return res.status(400).json({ message: 'Phone must be exactly 10 digits' });
    }

    try {
        await db.execute(
            'UPDATE Members SET name = ?, email = ?, phone = ?, plan = ?, status = ? WHERE id = ?',
            [name, email || null, phone, plan || null, status, id]
        );
        res.json({ message: 'Member updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Assign Features
const assignFeatures = async (req, res) => {
    const { id } = req.params;
    const { trainer_id, workout_plan_id, diet_plan_id } = req.body;
    try {
        await db.execute(
            'UPDATE Members SET trainer_id = ?, workout_plan_id = ?, diet_plan_id = ? WHERE id = ?',
            [trainer_id || null, workout_plan_id || null, diet_plan_id || null, id]
        );
        res.json({ message: 'Features assigned successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a member
const deleteMember = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM Members WHERE id = ?', [id]);
        res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Member Profile
const getMemberProfile = async (req, res) => {
    try {
        const [members] = await db.execute(`
            SELECT m.id, m.name, m.email, m.phone, m.join_date, m.plan, m.status,
                   t.name as trainer_name, w.title as workout_title, w.description as workout_desc, w.exercises,
                   d.title as diet_title, d.description as diet_desc, d.meals
            FROM Members m
            LEFT JOIN Trainers t ON m.trainer_id = t.id
            LEFT JOIN Workout_Plans w ON m.workout_plan_id = w.id
            LEFT JOIN Diet_Plans d ON m.diet_plan_id = d.id
            WHERE m.id = ?
        `, [req.user.id]);
        
        if (members.length === 0) return res.status(404).json({ message: 'Member not found' });
        
        const member = members[0];

        // Parse JSON fields if they are strings (some drivers do this automatically, some don't)
        if (member.exercises && typeof member.exercises === 'string') {
            member.exercises = JSON.parse(member.exercises);
        }
        if (member.meals && typeof member.meals === 'string') {
            member.meals = JSON.parse(member.meals);
        }

        // Get Active Plan
        const [subs] = await db.execute(`
            SELECT s.start_date, s.end_date, s.status, p.name, p.price,
                   DATEDIFF(s.end_date, CURDATE()) as days_left
            FROM Subscriptions s
            JOIN Membership_Plans p ON s.plan_id = p.id
            WHERE s.member_id = ? AND s.status = 'active'
            ORDER BY s.end_date DESC LIMIT 1
        `, [req.user.id]);

        // Get Latest Payment Status
        const [payments] = await db.execute('SELECT COUNT(id) as count FROM Payments WHERE member_id = ? AND status = "paid"', [req.user.id]);
        const payment_status = payments[0].count > 0 ? 'PAID' : 'UNPAID';

        res.json({
            profile: member,
            activePlan: subs.length > 0 ? subs[0] : null,
            payment_status
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getMembers, addMember, updateMember, assignFeatures, deleteMember, getMemberProfile };
