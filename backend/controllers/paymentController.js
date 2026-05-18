const db = require('../config/db');

// Get all payments with member and plan details (INNER JOIN)
const getPayments = async (req, res) => {
    try {
        const query = `
            SELECT p.id, p.amount, p.payment_date, p.status, 
                   m.name as member_name, 
                   s.start_date, s.end_date,
                   pl.name as plan_name
            FROM Payments p
            INNER JOIN Members m ON p.member_id = m.id
            LEFT JOIN Subscriptions s ON p.subscription_id = s.id
            LEFT JOIN Membership_Plans pl ON s.plan_id = pl.id
            ORDER BY p.payment_date DESC
        `;
        const [payments] = await db.query(query);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Record payment & create subscription
const addPayment = async (req, res) => {
    const { member_id, plan_id, amount, status } = req.body;
    try {
        // Calculate dates
        const [plan] = await db.execute('SELECT duration_months FROM Membership_Plans WHERE id = ?', [plan_id]);
        if(plan.length === 0) return res.status(404).json({ message: 'Plan not found' });
        
        const duration = plan[0].duration_months;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + duration);

        // Insert Subscription
        const [subResult] = await db.execute(
            'INSERT INTO Subscriptions (member_id, plan_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
            [member_id, plan_id, startDate, endDate, 'active']
        );

        // Insert Payment
        const [payResult] = await db.execute(
            'INSERT INTO Payments (member_id, subscription_id, amount, status) VALUES (?, ?, ?, ?)',
            [member_id, subResult.insertId, amount, status || 'paid']
        );

        res.status(201).json({ message: 'Payment and subscription recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Member buys a plan
const buyPlan = async (req, res) => {
    const member_id = req.user.id;
    const { plan_id, amount } = req.body;
    try {
        const [plan] = await db.execute('SELECT duration_months FROM Membership_Plans WHERE id = ?', [plan_id]);
        if(plan.length === 0) return res.status(404).json({ message: 'Plan not found' });
        
        const duration = plan[0].duration_months;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + duration);

        // Cancel previous active subscriptions
        await db.execute('UPDATE Subscriptions SET status = "expired" WHERE member_id = ? AND status = "active"', [member_id]);

        // Insert new Subscription
        const [subResult] = await db.execute(
            'INSERT INTO Subscriptions (member_id, plan_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
            [member_id, plan_id, startDate, endDate, 'active']
        );

        // Insert Payment
        await db.execute(
            'INSERT INTO Payments (member_id, subscription_id, amount, status) VALUES (?, ?, ?, ?)',
            [member_id, subResult.insertId, amount, 'paid']
        );

        res.status(201).json({ message: 'Plan purchased successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Invoice
const getInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT p.id as invoice_id, p.amount, p.payment_date, p.status, 
                   m.name as member_name, m.email, m.phone,
                   pl.name as plan_name, pl.description
            FROM Payments p
            INNER JOIN Members m ON p.member_id = m.id
            LEFT JOIN Subscriptions s ON p.subscription_id = s.id
            LEFT JOIN Membership_Plans pl ON s.plan_id = pl.id
            WHERE p.id = ?
        `;
        const [invoice] = await db.query(query, [id]);
        if(invoice.length === 0) return res.status(404).json({ message: 'Invoice not found' });
        
        res.json(invoice[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPayments, addPayment, buyPlan, getInvoice };
