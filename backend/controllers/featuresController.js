const db = require('../config/db');

const getTrainers = async (req, res) => {
    try {
        const [trainers] = await db.query('SELECT * FROM Trainers');
        res.json(trainers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWorkoutPlans = async (req, res) => {
    try {
        const [plans] = await db.query('SELECT * FROM Workout_Plans');
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDietPlans = async (req, res) => {
    try {
        const [plans] = await db.query('SELECT * FROM Diet_Plans');
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const memberId = req.user.id;
        const notifications = [];

        // Plan expiry alert
        const [subs] = await db.execute(`
            SELECT end_date, DATEDIFF(end_date, CURDATE()) as days_left
            FROM Subscriptions
            WHERE member_id = ? AND status = 'active'
        `, [memberId]);

        if (subs.length > 0) {
            const daysLeft = subs[0].days_left;
            if (daysLeft <= 7 && daysLeft >= 0) {
                notifications.push({ type: 'warning', message: `Your plan expires in ${daysLeft} days.` });
            } else if (daysLeft < 0) {
                notifications.push({ type: 'danger', message: 'Your plan has expired. Please renew.' });
            }
        }

        // Payment reminder
        const [payments] = await db.execute('SELECT COUNT(*) as pending FROM Payments WHERE member_id = ? AND status = "pending"', [memberId]);
        if (payments[0].pending > 0) {
            notifications.push({ type: 'danger', message: `You have ${payments[0].pending} pending payment(s).` });
        }

        // New offers (static for now)
        notifications.push({ type: 'info', message: 'Get 20% off on Annual VIP Plan!' });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTrainers, getWorkoutPlans, getDietPlans, getNotifications };
