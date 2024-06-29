CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE attributes (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(id),
    title VARCHAR(200),
    content TEXT DEFAULT '',
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (post_id) REFERENCES posts(id),
);

CREATE TABLE threads (
    id SERIAL PRIMARY KEY,
    attribute_id INT REFERENCES atttributes(id),
    content TEXT DEFAULT '',
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id),
);