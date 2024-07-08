-- Drop the posts table first to remove the dependency on threads
DROP TABLE IF EXISTS posts;

-- Drop the threads table
DROP TABLE IF EXISTS threads;

-- Create threads table
CREATE TABLE IF NOT EXISTS threads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    root_content TEXT DEFAULT '',
    user_id VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    up_votes INT DEFAULT 0,
    down_votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_category_title_user UNIQUE (category, title, user_id)
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    thread_id INT NOT NULL,
    content TEXT DEFAULT '',
    user_id VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    up_votes INT DEFAULT 0,
    down_votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS user_id_idx ON posts(user_id);
CREATE INDEX IF NOT EXISTS threads_category_idx ON threads(category);
CREATE INDEX IF NOT EXISTS posts_thread_id_idx ON posts(thread_id);
CREATE INDEX IF NOT EXISTS posts_thread_id_created_at_idx ON posts(thread_id, created_at);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at);
