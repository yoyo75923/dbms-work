-- Create the database
CREATE DATABASE IF NOT EXISTS nss_iitp;
USE nss_iitp;

-- Create user role enum
CREATE TABLE user_roles (
    role_id INT PRIMARY KEY,
    role_name VARCHAR(20)
);

INSERT INTO user_roles (role_id, role_name) VALUES
(1, 'volunteer'),
(2, 'mentor'),
(3, 'gen_sec');

-- Create attendance type enum
CREATE TABLE attendance_types (
    type_id INT PRIMARY KEY,
    type_name VARCHAR(20)
);

INSERT INTO attendance_types (type_id, type_name) VALUES
(1, 'present'),
(2, 'absent');

-- Create users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(20) NOT NULL,
    wing_name VARCHAR(100),
    FOREIGN KEY (role_id) REFERENCES user_roles(role_id)
);

-- Create mentor table
CREATE TABLE mentors (
    mentor_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mentee_count INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create volunteer table
CREATE TABLE volunteers (
    volunteer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mentor_id INT,
    total_hours INT DEFAULT 0,
    events_attended INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id)
);

-- Create general secretary table
CREATE TABLE gen_secs (
    gensec_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create events table
CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    description TEXT,
    duration_hours INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  volunteer_id INT NOT NULL,
  event_id VARCHAR(255) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  hours DECIMAL(5,2) NOT NULL,
  venue VARCHAR(255) NOT NULL,
  marked_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (volunteer_id) REFERENCES volunteers(id),
  FOREIGN KEY (marked_by) REFERENCES mentors(id)
);

-- Create hours_modification_log table
CREATE TABLE hours_modification_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    volunteer_id INT NOT NULL,
    modified_by INT NOT NULL,
    event_id INT NOT NULL,
    old_hours INT NOT NULL,
    new_hours INT NOT NULL,
    modification_date DATETIME NOT NULL,
    reason TEXT,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(volunteer_id),
    FOREIGN KEY (modified_by) REFERENCES users(user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

-- Create gallery table
CREATE TABLE galleries (
    gallery_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    title VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Create media table (for both photos and videos)
CREATE TABLE media (
    media_id INT AUTO_INCREMENT PRIMARY KEY,
    gallery_id INT,
    uploaded_by INT NOT NULL,
    media_type ENUM('photo', 'video') NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    FOREIGN KEY (gallery_id) REFERENCES galleries(gallery_id),
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
);

-- Create donations table
CREATE TABLE donations (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    donation_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_volunteer_mentor ON volunteers(mentor_id);
CREATE INDEX idx_attendance_volunteer ON attendance(volunteer_id);
CREATE INDEX idx_attendance_event ON attendance(event_id);
CREATE INDEX idx_gallery_event ON galleries(event_id);
CREATE INDEX idx_media_gallery ON media(gallery_id);
CREATE INDEX idx_media_uploader ON media(uploaded_by); 