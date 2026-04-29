CREATE DATABASE IF NOT EXISTS gym_db;
USE gym_db;

DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS Subscriptions;
DROP TABLE IF EXISTS Membership_Plans;
DROP TABLE IF EXISTS Members;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    join_date DATE NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Membership_Plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_months INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
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

-- Insert Default Admin (password: admin123)
INSERT INTO Users (username, password, role) VALUES ('admin', '$2a$10$kOBXHBcrrWMbvBFtlFhjN.cTwiWhk5NRuFeD6HyAQktZE/Z9g8nRC', 'admin');

-- Sample Data
INSERT INTO Membership_Plans (name, description, duration_months, price) VALUES 
('Basic Plan', 'Access to cardio and weights', 1, 30.00),
('Premium Plan', 'All access including classes and sauna', 3, 80.00),
('Annual VIP', 'Unlimited access with personal locker', 12, 300.00);

INSERT INTO Members (name, email, phone, join_date, status) VALUES 
('John Doe', 'john@example.com', '1234567890', '2023-01-15', 'active'),
('Jane Smith', 'jane@example.com', '0987654321', '2023-05-20', 'active'),
('Bob Johnson', 'bob@example.com', '1122334455', '2023-08-10', 'inactive');

INSERT INTO Subscriptions (member_id, plan_id, start_date, end_date, status) VALUES 
(1, 1, '2023-01-15', '2023-02-15', 'expired'),
(1, 3, '2023-02-15', '2024-02-15', 'active'),
(2, 2, '2023-05-20', '2023-08-20', 'active');

INSERT INTO Payments (member_id, subscription_id, amount, status) VALUES 
(1, 1, 30.00, 'paid'),
(1, 2, 300.00, 'paid'),
(2, 3, 80.00, 'paid');
