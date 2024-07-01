-- Drop tables if they exist
DROP TABLE IF EXISTS threads;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS category;


-- Create posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    thread_id INT NOT NULL,
    content TEXT DEFAULT '',
    user_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX category_idx ON posts(category);
CREATE INDEX user_id_idx ON posts(user_id);

-- Create threads table
CREATE TABLE threads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200 NOT NULL),
    -- post_id INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    root_content TEXT DEFAULT '',
    user_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES posts(thread_id) ON DELETE CASCADE
);

CREATE INDEX threads_category_idx ON threads(category);
