


-- Create threads table
CREATE TABLE threads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    root_content TEXT DEFAULT '',
    user_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO threads (title, category, root_content, user_id)
VALUES 
('First Thread Title', 'General', 'This is the root content for the first thread', 'user123'),
('Second Thread Title', 'Announcements', 'This is the root content for the second thread', 'user456'),
('Third Thread Title', 'Feedback', 'This is the root content for the third thread', 'user789');


-- Create posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    thread_id INT NOT NULL,
    content TEXT DEFAULT '',
    user_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
);

INSERT INTO posts (thread_id, content, user_id)
VALUES 
(1, 'This is the first post in thread 1', 'user123'),
(1, 'This is the second post in thread 1', 'user456'),
(2, 'This is the first post in thread 2', 'user789'),
(3, 'This is the first post in thread 3', 'user123');

CREATE INDEX user_id_idx ON posts(user_id);
CREATE INDEX threads_category_idx ON threads(category);
