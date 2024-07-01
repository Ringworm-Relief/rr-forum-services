DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS attributes;
DROP TABLE IF EXISTS threads;

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    category VARCHAR(200)
);

CREATE TABLE attributes (
    attribute_id SERIAL PRIMARY KEY,
    category_id
    category VARCHAR(30),
    title VARCHAR(200),
    content TEXT DEFAULT '',
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() 
);

CREATE TABLE threads (
    thread_id SERIAL PRIMARY KEY,
    attribute_id INT REFERENCES attributes(attribute_id),
    content TEXT DEFAULT '',
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (attribute_id) REFERENCES attributes(attribute_id) ON DELETE CASCADE
);


SELECT *  
FROM posts
INNER JOIN attributes ON posts.category=attributes.category
FOR JSON AUTO

SELECT *
FROM attributes
INNER JOIN threads ON attributes.attribute_id=threads.attribute_id
FOR JSON AUTO

-- INSERT INTO posts (category) VALUES 
-- ('Cleaning'),
-- ('Treatment'),
-- ('General');

-- Insert sample data into attributes table
-- INSERT INTO attributes (category, title, content, user_id) VALUES 
-- ('Cleaning', 'How to clean hardwood floors?', 'Whats the best way to clean and maintain hardwood floors?', 1),
-- ('Treatment', 'Effective remedies for headaches?', 'What are some quick ways to get rid of a headache?', 2);

-- -- Insert sample data into threads table
-- INSERT INTO threads (attribute_id, content, user_id) VALUES 
-- (1, 'I use a mixture of vinegar and water. Works great!', 2),
-- (1, 'Make sure not to use too much water, it can damage the wood.', 3),
-- (2, 'I find that drinking water and resting in a dark room helps.', 3),
-- (2, 'Peppermint oil on the temples works wonders for me.', 4);

-- Select data to verify the structure and relationships
-- SELECT 
--     p.id AS post_id,
--     p.category AS post_category,
--     a.attribute_id AS attribute_id,
--     a.title AS attribute_title,
--     t.thread_id AS thread_id,
--     t.content AS thread_content
-- FROM 
--     posts p
-- INNER JOIN 
--     attributes a ON p.id = a.post_id
-- INNER JOIN 
--     threads t ON a.attribute_id = t.attribute_id;



-- INSERT INTO attributes (post_id, title, content, user_id) VALUES (1, 'title', 1);
