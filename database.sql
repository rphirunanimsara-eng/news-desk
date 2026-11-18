CREATE DATABASE IF NOT EXISTS newsdesk CHARACTER SET utf8mb4;
USE newsdesk;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','student') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt VARCHAR(255),
  content TEXT NOT NULL,
  category_id INT,
  image VARCHAR(255),
  author_id INT,
  status ENUM('draft','pending','published','rejected') DEFAULT 'draft',
  featured TINYINT DEFAULT 0,
  breaking TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT NOT NULL,
  user_id INT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name) VALUES
('Academic'),('Events'),('Sports'),('General'),
('Computing Faculty'),('Business Faculty'),('Engineering Faculty'),('Medicine Faculty');

INSERT INTO announcements (title) VALUES
('University closed on 31 May'),('Semester registration deadline extended');