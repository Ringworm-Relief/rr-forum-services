-- Drop tables if they exist
DROP TABLE IF EXISTS threads;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS category;

-- Create category table
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    category VARCHAR(200) NOT NULL
);

-- Create posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT DEFAULT '',
    user_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);

-- Create threads table
CREATE TABLE threads (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    content TEXT DEFAULT '',
    user_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Insert predefined categories
INSERT INTO category (category) VALUES 
('Cleaning'),
('Treatment'),
('General');

