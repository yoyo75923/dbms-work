-- Create database if not exists
CREATE DATABASE IF NOT EXISTS nss_iitp;
USE nss_iitp;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  roll_number VARCHAR(50) UNIQUE NOT NULL,
  role ENUM('volunteer', 'mentor', 'secretary') NOT NULL,
  wing VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  hours DECIMAL(5,2) NOT NULL DEFAULT 1,
  created_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id VARCHAR(36) PRIMARY KEY,
  event_id VARCHAR(36),
  volunteer_id VARCHAR(36),
  status VARCHAR(50) DEFAULT 'present',
  marked_by VARCHAR(36),
  marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (volunteer_id) REFERENCES users(id),
  FOREIGN KEY (marked_by) REFERENCES users(id),
  UNIQUE(event_id, volunteer_id)
);

-- Create mentor_assignments table
CREATE TABLE IF NOT EXISTS mentor_assignments (
  id VARCHAR(36) PRIMARY KEY,
  mentor_id VARCHAR(36),
  volunteer_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mentor_id) REFERENCES users(id),
  FOREIGN KEY (volunteer_id) REFERENCES users(id),
  UNIQUE(volunteer_id)
);

-- Insert sample data only if tables are empty
INSERT INTO users (id, email, name, roll_number, role, wing)
SELECT * FROM (
  SELECT 
    '1' AS id, 
    'aaravmehta@iitp.ac.in' AS email, 
    'Aarav Mehta' AS name, 
    '2101CS01' AS roll_number, 
    'volunteer' AS role, 
    'Computer Science' AS wing
) AS tmp
WHERE NOT EXISTS (
  SELECT id FROM users WHERE id = '1'
) LIMIT 1;

-- Repeat for other users
INSERT INTO users (id, email, name, roll_number, role, wing)
SELECT * FROM (
  SELECT 
    '2' AS id, 
    'siyasharma@iitp.ac.in' AS email, 
    'Siya Sharma' AS name, 
    '2101ME02' AS roll_number, 
    'volunteer' AS role, 
    'Mechanical' AS wing
) AS tmp
WHERE NOT EXISTS (
  SELECT id FROM users WHERE id = '2'
) LIMIT 1;

-- Add remaining users similarly...

-- Insert mentor assignments only if they don't exist
INSERT INTO mentor_assignments (id, mentor_id, volunteer_id)
SELECT * FROM (
  SELECT 
    '1' AS id, 
    '12' AS mentor_id, 
    '1' AS volunteer_id
) AS tmp
WHERE NOT EXISTS (
  SELECT id FROM mentor_assignments WHERE id = '1'
) LIMIT 1;

-- Add remaining mentor assignments similarly... 