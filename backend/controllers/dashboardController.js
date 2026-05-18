const db = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        // Aggregate functions and GROUP BY queries
        const [[{ totalMembers }]] = await db.query('SELECT COUNT(*) as totalMembers FROM Members');
        const [[{ activeSubscriptions }]] = await db.query("SELECT COUNT(*) as activeSubscriptions FROM Subscriptions WHERE status = 'active'");
        const [[{ totalRevenue }]] = await db.query("SELECT SUM(amount) as totalRevenue FROM Payments WHERE status = 'paid'");
        const [[{ pendingPayments }]] = await db.query("SELECT COUNT(*) as pendingPayments FROM Payments WHERE status = 'pending'");

        // Monthly Revenue (GROUP BY)
        const [monthlyRevenue] = await db.query(`
            SELECT DATE_FORMAT(payment_date, '%Y-%m') as month, SUM(amount) as revenue 
            FROM Payments 
            WHERE status = 'paid' 
            GROUP BY month 
            ORDER BY month ASC
            LIMIT 6
        `);

        // Members joined per month
        const [monthlyMembers] = await db.query(`
            SELECT DATE_FORMAT(join_date, '%Y-%m') as month, COUNT(*) as count 
            FROM Members 
            GROUP BY month 
            ORDER BY month ASC
            LIMIT 6
        `);

        // Member status
        const [[{ activeMembers }]] = await db.query("SELECT COUNT(*) as activeMembers FROM Members WHERE status = 'active'");
        const [[{ inactiveMembers }]] = await db.query("SELECT COUNT(*) as inactiveMembers FROM Members WHERE status = 'inactive'");

        // Attendance Stats
        const today = new Date().toISOString().split('T')[0];
        const [[{ presentToday }]] = await db.query('SELECT COUNT(*) as presentToday FROM Attendance WHERE date = ? AND status = "present"', [today]);
        
        const [monthlyAttendance] = await db.query(`
            SELECT DATE_FORMAT(date, '%Y-%m') as month, COUNT(*) as count 
            FROM Attendance 
            WHERE status = 'present'
            GROUP BY month 
            ORDER BY month ASC
            LIMIT 6
        `);

        // Recent Activity
        const [recentMembers] = await db.query('SELECT name, join_date FROM Members ORDER BY join_date DESC LIMIT 5');
        
        res.json({
            cards: {
                totalMembers,
                activeSubscriptions,
                totalRevenue: totalRevenue || 0,
                pendingPayments,
                presentToday: presentToday || 0
            },
            charts: {
                monthlyRevenue,
                monthlyMembers,
                monthlyAttendance,
                memberStatus: { active: activeMembers, inactive: inactiveMembers }
            },
            recentMembers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
