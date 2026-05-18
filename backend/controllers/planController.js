const db = require('../config/db');

const getPlans = async (req, res) => {
    try {
        const [plans] = await db.query('SELECT * FROM Membership_Plans ORDER BY price ASC');
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addPlan = async (req, res) => {
    const { name, description, duration_months, price, discount_price } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO Membership_Plans (name, description, duration_months, price, discount_price) VALUES (?, ?, ?, ?, ?)',
            [name, description, duration_months, price, discount_price || price]
        );
        res.status(201).json({ id: result.insertId, name, description, duration_months, price, discount_price });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePlan = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM Membership_Plans WHERE id = ?', [id]);
        res.json({ message: 'Plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPlans, addPlan, deletePlan };
