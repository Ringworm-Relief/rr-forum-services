DROP TABLE IF EXISTS threads;
DROP TABLE IF EXISTS posts;

-- Create threads table
CREATE TABLE threads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    root_content TEXT DEFAULT '',
    user_id VARCHAR(50) NOT NULL,
    up_votes INT DEFAULT 0,
    down_votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    thread_id INT NOT NULL,
    content TEXT DEFAULT '',
    user_id VARCHAR(50) NOT NULL,
    up_votes INT DEFAULT 0,
    down_votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
);

CREATE INDEX user_id_idx ON posts(user_id);
CREATE INDEX threads_category_idx ON threads(category);
