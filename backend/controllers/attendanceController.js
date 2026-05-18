const db = require('../config/db');

// Mark Attendance (Member manual)
const markAttendance = async (req, res) => {
    try {
        const memberId = req.user.id;
        const today = new Date().toISOString().split('T')[0];

        const [existing] = await db.execute('SELECT * FROM Attendance WHERE member_id = ? AND date = ?', [memberId, today]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Attendance already marked for today' });
        }

        await db.execute('INSERT INTO Attendance (member_id, date, status) VALUES (?, ?, ?)', [memberId, today, 'present']);
        res.status(201).json({ message: 'Attendance marked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Member's own attendance history
const getMyAttendance = async (req, res) => {
    try {
        const memberId = req.user.id;
        const [history] = await db.execute('SELECT date, status FROM Attendance WHERE member_id = ? ORDER BY date DESC', [memberId]);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all attendance (Admin) with filters
const getAllAttendance = async (req, res) => {
    try {
        const { date, member_name } = req.query;
        let query = `
            SELECT a.id, a.date, a.status, m.name, m.mobile_number 
            FROM Attendance a
            JOIN Members m ON a.member_id = m.id
        `;
        let conditions = [];
        let params = [];

        if (date) {
            conditions.push('a.date = ?');
            params.push(date);
        }
        if (member_name) {
            conditions.push('m.name LIKE ?');
            params.push(`%${member_name}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY a.date DESC';

        const [records] = await db.query(query, params);
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark Attendance Admin (Feature 3)
const markAttendanceAdmin = async (req, res) => {
    try {
        const { member_id, date, status } = req.body;
        const [existing] = await db.execute('SELECT * FROM Attendance WHERE member_id = ? AND date = ?', [member_id, date]);
        if (existing.length > 0) {
            await db.execute('UPDATE Attendance SET status = ? WHERE member_id = ? AND date = ?', [status, member_id, date]);
        } else {
            await db.execute('INSERT INTO Attendance (member_id, date, status) VALUES (?, ?, ?)', [member_id, date, status]);
        }
        res.json({ message: 'Attendance updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Attendance Admin (Feature 3)
const getAttendanceAdmin = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }
        const query = `
            SELECT m.id as member_id, m.name, 
                   COALESCE(a.status, 'Absent') as status
            FROM Members m
            LEFT JOIN Attendance a ON m.id = a.member_id AND a.date = ?
            WHERE m.status = 'Active'
            ORDER BY m.name ASC
        `;
        const [records] = await db.execute(query, [date]);
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { markAttendance, getMyAttendance, getAllAttendance, markAttendanceAdmin, getAttendanceAdmin };
