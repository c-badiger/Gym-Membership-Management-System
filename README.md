# Gym Membership Management System (Phase 2 Refined)

A production-quality full-stack web application designed for academic project submissions (VTU level). Built with Node.js, Express, MySQL, and Vanilla Frontend.

## 🗄️ Database ER Diagram (3NF Normalized)

The database `gym_db` is normalized up to 3NF and consists of 9 main tables:

1. **Users** (Admin/Staff Login)
   - `id` (PK), `username`, `password`, `role`

2. **Members** (Primary Table)
   - `id` (PK), `name`, `email` (Optional), `mobile_number` (Unique, Primary Login), `password`, `join_date`, `status`, `trainer_id`, `workout_plan_id`, `diet_plan_id`
   - *Strict Validation:* Mobile number must be exactly 10 digits.

3. **Membership_Plans**
   - `id` (PK), `name`, `description`, `duration_months`, `price`, `discount_price`

4. **Subscriptions**
   - `id` (PK), `member_id` (FK), `plan_id` (FK), `start_date`, `end_date`, `status`

5. **Payments**
   - `id` (PK), `member_id` (FK), `subscription_id` (FK), `amount`, `payment_date`, `status`

6. **Attendance**
   - `id` (PK), `member_id` (FK), `date`, `status`

7. **Trainers**
   - `id` (PK), `name`, `specialization`
    
8. **Workout_Plans**
   - `id` (PK), `title`, `description`, `exercises` (JSON)

9. **Diet_Plans**
   - `id` (PK), `title`, `description`, `meals` (JSON)

## 🚀 Instructions to Run

### 1. Database Setup
1. Ensure you have **MySQL/XAMPP/WAMP** installed and running.
2. Execute the SQL script located at `database/schema.sql`.

### 2. Backend Setup
1. `cd backend`
2. `npm install`
3. Configure `.env` with your MySQL credentials.
4. `npm run dev`

### 3. Frontend Setup
1. Open `index.html` in your browser.
2. **Admin Portal:** `admin` / `admin123`.
3. **Member Portal:** Use registered 10-digit mobile number and password (e.g., `9876543210` / `member123`).

## 🌟 Key Features & Improvements

- **Mobile-First Authentication:** Transitioned from email to **Mobile Number** as the primary identifier. Implemented strict 10-digit validation on both frontend and backend.
- **Enriched Member Home:** A visually stunning Home section for members with motivational banners and feature cards.
- **Structured Diet & Workout:** Upgraded plans to support structured JSON data, rendering detailed meals and exercise routines in a clean card layout.
- **Removed QR Code Attendance:** Streamlined the system by removing QR-based attendance to focus on profile and plan management.
- **Advanced Dashboard Analytics:** Integrated `Chart.js` for real-time revenue and membership trends.
- **Live Notifications:** Expiring plan warnings and payment reminders directly on the Member UI.
- **3NF Database Adherence:** Ensuring data integrity and performance through strict normalization.
