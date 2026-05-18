CREATE DATABASE IF NOT EXISTS gym_db;
USE gym_db;

DROP TABLE IF EXISTS OTP_TABLE;
DROP TABLE IF EXISTS Attendance;
DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS Subscriptions;
DROP TABLE IF EXISTS Membership_Plans;
DROP TABLE IF EXISTS Members;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Trainers;
DROP TABLE IF EXISTS Workout_Plans;
DROP TABLE IF EXISTS Diet_Plans;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Trainers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Workout_Plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    exercises JSON, -- Adding structured exercises
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Diet_Plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    meals JSON, -- Adding structured meals
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL, -- Primary login field
    email VARCHAR(100) UNIQUE, -- Optional
    password VARCHAR(255) NOT NULL,
    join_date DATE NOT NULL,
    plan VARCHAR(100),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    trainer_id INT,
    workout_plan_id INT,
    diet_plan_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES Trainers(id) ON DELETE SET NULL,
    FOREIGN KEY (workout_plan_id) REFERENCES Workout_Plans(id) ON DELETE SET NULL,
    FOREIGN KEY (diet_plan_id) REFERENCES Diet_Plans(id) ON DELETE SET NULL
);

CREATE TABLE Membership_Plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_months INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES Members(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES Membership_Plans(id) ON DELETE RESTRICT
);

CREATE TABLE Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    subscription_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('paid', 'pending', 'failed') DEFAULT 'paid',
    FOREIGN KEY (member_id) REFERENCES Members(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES Subscriptions(id) ON DELETE SET NULL
);

CREATE TABLE Attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent') DEFAULT 'Absent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_attendance (member_id, date),
    FOREIGN KEY (member_id) REFERENCES Members(id) ON DELETE CASCADE
);

CREATE TABLE OTP_TABLE (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(15) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Admin (password: admin123)
INSERT INTO Users (name, email, password, role) VALUES ('Admin User', 'admin@example.com', '$2a$10$kOBXHBcrrWMbvBFtlFhjN.cTwiWhk5NRuFeD6HyAQktZE/Z9g8nRC', 'admin');

-- Sample Data
INSERT INTO Trainers (name, specialization) VALUES 
('Alex Johnson', 'Weightlifting'),
('Maria Garcia', 'Yoga & Pilates'),
('David Smith', 'Cardio & Endurance');

-- Structured Workout Plans
INSERT INTO Workout_Plans (title, description, exercises) VALUES 
('Beginner Full Body', 'Focus on fundamental movements and form.', '{"schedule": "3 days/week", "routine": [{"exercise": "Squats", "sets": 3, "reps": 12}, {"exercise": "Push-ups", "sets": 3, "reps": 10}, {"exercise": "Dumbbell Rows", "sets": 3, "reps": 12}, {"exercise": "Plank", "sets": 3, "reps": "45s"}]}'),
('Advanced Hypertrophy', 'High volume training for muscle growth.', '{"schedule": "5 days/week", "routine": [{"exercise": "Bench Press", "sets": 4, "reps": 8}, {"exercise": "Deadlift", "sets": 3, "reps": 5}, {"exercise": "Shoulder Press", "sets": 4, "reps": 10}, {"exercise": "Bicep Curls", "sets": 3, "reps": 15}]}'),
('Cardio Blast', 'HIIT and endurance training.', '{"schedule": "4 days/week", "routine": [{"exercise": "Running", "sets": 1, "reps": "30 mins"}, {"exercise": "Burpees", "sets": 4, "reps": 20}, {"exercise": "Jump Rope", "sets": 5, "reps": "2 mins"}]}');

-- Structured Diet Plans
INSERT INTO Diet_Plans (title, description, meals) VALUES 
('Weight Loss', 'Calorie-deficit focused on high protein and fiber.', '{"calories": 1800, "meals": {"breakfast": "Oatmeal with berries", "lunch": "Grilled chicken salad", "dinner": "Baked salmon with asparagus", "snacks": "Greek yogurt or almonds"}}'),
('Muscle Gain', 'High calorie and protein for muscle recovery.', '{"calories": 3000, "meals": {"breakfast": "Scrambled eggs and toast", "lunch": "Beef and rice bowl", "dinner": "Pasta with turkey meat", "snacks": "Protein shake and banana"}}'),
('Balanced Nutrition', 'Maintain energy levels and overall health.', '{"calories": 2200, "meals": {"breakfast": "Smoothie bowl", "lunch": "Quinoa and roasted veggies", "dinner": "Stir-fry tofu with brown rice", "snacks": "Fruit and cottage cheese"}}');

INSERT INTO Membership_Plans (name, description, duration_months, price, discount_price) VALUES 
('Basic Plan', 'Access to cardio and weights', 1, 30.00, 24.99),
('Premium Plan', 'All access including classes and sauna, personal trainer', 3, 80.00, 69.99),
('Annual VIP', 'Unlimited access, personal locker, custom diet plan', 12, 300.00, 249.99);

-- Members password: member123
INSERT INTO Members (name, email, phone, password, join_date, plan, status, trainer_id, workout_plan_id, diet_plan_id) VALUES 
('John Doe', 'john@example.com', '9876543210', '$2a$10$kOBXHBcrrWMbvBFtlFhjN.cTwiWhk5NRuFeD6HyAQktZE/Z9g8nRC', '2023-01-15', 'Premium Plan', 'Active', 1, 2, 2),
('Jane Smith', 'jane@example.com', '9000000001', '$2a$10$kOBXHBcrrWMbvBFtlFhjN.cTwiWhk5NRuFeD6HyAQktZE/Z9g8nRC', '2023-05-20', 'Basic Plan', 'Active', 2, 1, 1),
('Bob Johnson', 'bob@example.com', '8000000002', '$2a$10$kOBXHBcrrWMbvBFtlFhjN.cTwiWhk5NRuFeD6HyAQktZE/Z9g8nRC', '2023-08-10', NULL, 'Inactive', NULL, NULL, NULL);

INSERT INTO Subscriptions (member_id, plan_id, start_date, end_date, status) VALUES 
(1, 1, '2023-01-15', '2023-02-15', 'expired'),
(1, 3, '2023-02-15', '2024-02-15', 'active'),
(2, 2, '2023-05-20', '2023-08-20', 'active');

INSERT INTO Payments (member_id, subscription_id, amount, status) VALUES 
(1, 1, 30.00, 'paid'),
(1, 2, 300.00, 'paid'),
(2, 3, 80.00, 'paid');

INSERT INTO Attendance (member_id, date, status) VALUES 
(1, CURRENT_DATE(), 'Present'),
(2, CURRENT_DATE(), 'Present');
