const db = require('../config/db');

// Get all members
const getMembers = async (req, res) => {
    try {
        const [members] = await db.query('SELECT * FROM Members ORDER BY created_at DESC');
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a member
const addMember = async (req, res) => {
    const { name, email, phone, join_date, status } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO Members (name, email, phone, join_date, status) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, join_date, status || 'active']
        );
        res.status(201).json({ id: result.insertId, name, email, phone, join_date, status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a member
const updateMember = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, status } = req.body;
    try {
        await db.execute(
            'UPDATE Members SET name = ?, email = ?, phone = ?, status = ? WHERE id = ?',
            [name, email, phone, status, id]
        );
        res.json({ message: 'Member updated successfully' });
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

module.exports = { getMembers, addMember, updateMember, deleteMember };
