# Gym Membership Management System

A production-quality full-stack web application designed for academic project submissions. Built with Node.js, Express, MySQL, and Vanilla Frontend.

## 🗄️ Database ER Diagram (Text Explanation)

The database `gym_db` is normalized up to 3NF and consists of 5 main tables:

1. **Users** (Admin/Staff Login)
   - `id` (PK)
   - `username` (Unique)
   - `password` (Hashed)
   - `role`
   - *Relationships:* Independent table for system access control.

2. **Members**
   - `id` (PK)
   - `name`, `email` (Unique), `phone`, `join_date`, `status`
   - *Relationships:* 
     - 1-to-many with `Subscriptions` (One member can have multiple subscriptions over time).
     - 1-to-many with `Payments` (One member can make multiple payments).

3. **Membership_Plans**
   - `id` (PK)
   - `name`, `description`, `duration_months`, `price`
   - *Relationships:* 1-to-many with `Subscriptions` (One plan can be assigned to multiple subscriptions).

4. **Subscriptions**
   - `id` (PK)
   - `member_id` (FK -> Members.id)
   - `plan_id` (FK -> Membership_Plans.id)
   - `start_date`, `end_date`, `status`
   - *Relationships:* 
     - Links `Members` and `Membership_Plans` (Many-to-Many resolved).
     - 1-to-many with `Payments` (One subscription can be paid via one or multiple payments, usually 1-to-1 in this setup).

5. **Payments**
   - `id` (PK)
   - `member_id` (FK -> Members.id)
   - `subscription_id` (FK -> Subscriptions.id)
   - `amount`, `payment_date`, `status`
   - *Relationships:* Tracks the financial transaction for a specific subscription and member.

## 🚀 Instructions to Run

### 1. Database Setup
1. Ensure you have **MySQL/XAMPP/WAMP** installed and running.
2. Open your MySQL client (e.g., phpMyAdmin or MySQL Workbench).
3. Execute the SQL script located at `database/schema.sql` to create the schema, tables, and insert default sample data.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the required Node.js dependencies:
   ```bash
   npm install
   ```
3. Check the `.env` file in the `backend` folder and ensure your MySQL credentials are correct:
   ```env
   DB_USER=root
   DB_PASS=
   DB_NAME=gym_db
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   *The server will start running on http://localhost:5000*

### 3. Frontend Setup
1. You can simply open the `index.html` file in the root folder in any web browser.
2. Alternatively, use a tool like **Live Server** (VS Code Extension) to serve the folder to prevent CORS or local file protocol issues.
3. Login using the default admin credentials:
   - **Username:** `admin`
   - **Password:** `admin123`

## 🌟 Key Features Implemented
- JWT Authentication & Secure Password Hashing (bcrypt)
- Advanced SQL Analytics (INNER JOIN, GROUP BY, Aggregate functions)
- Responsive Glassmorphism UI Dashboard
- Chart.js Data Visualizations
- Complete CRUD operations for Members, Plans, and Payments.
