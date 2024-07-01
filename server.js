const express = require('express');
const { Pool } = require('pg'); // Ensure you import Pool from pg module
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Load environment variables from .env file
require('dotenv').config();

// Configure the connection pool to PostgreSQL using environment variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(express.json());

const corsOptions = {
  origin: [/^http:\/\/localhost:\d+$/, "https://rr-as.vercel.app/"],
  methods: 'GET,POST',          
  allowedHeaders: 'Content-Type,Authorization', 
};

app.use(cors(corsOptions));

// Endpoint to fetch posts and their threads by category
app.get('/posts/:category', async (req, res) => {
    const category = req.params.category; // Get the category from the request parameters
    try {
        const { rows } = await pool.query(`
            SELECT 
                p.id AS post_id,
                p.title AS post_title,
                p.content AS post_content,
                p.user_id AS post_user_id,
                p.created_at AS post_created_at,
                json_agg(json_build_object(
                    'thread_id', t.id,
                    'content', t.content,
                    'user_id', t.user_id,
                    'created_at', t.created_at
                )) AS threads
            FROM 
                posts p
            LEFT JOIN 
                threads t ON p.id = t.post_id
            JOIN 
                category c ON c.id = p.category_id
            WHERE 
                c.category = $1
            GROUP BY 
                p.id, p.title, p.content, p.user_id, p.created_at;
        `, [category]); // Use the category from the request parameters
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to get a single post
app.get('/posts/:category/:id', async (req, res) => {
    const { category, id } = req.params; // Get the id from the request parameters
    try {
        const { rows } = await pool.query(`
            SELECT 
                p.id AS post_id,
                p.title AS post_title,
                p.content AS post_content,
                p.user_id AS post_user_id,
                p.created_at AS post_created_at,
                json_agg(json_build_object(
                    'thread_id', t.id,
                    'content', t.content,
                    'user_id', t.user_id,
                    'created_at', t.created_at
                )) AS threads
            FROM 
                posts p
            LEFT JOIN 
                threads t ON p.id = t.post_id
            JOIN 
                category c ON c.id = p.category_id
            WHERE 
                c.category = $1 AND p.id = $2
            GROUP BY 
                p.id, p.title, p.content, p.user_id, p.created_at;
        `, [category, id]); // Use the category and id from the request parameters
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to create a new post
app.post('/posts/:category', async (req, res) => {
    const { category } = req.params; // Get category from URL parameter
    const { title, content, user_id } = req.body; // Get other required fields from the request body

    // Validate the required fields
    if (!category || !title || !user_id) {
        return res.status(400).json({ message: 'Category, title, and user_id are required' });
    }

    try {
        // First, get the category_id from the category name
        const categoryResult = await pool.query('SELECT id FROM category WHERE category = $1', [category]);
        if (categoryResult.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const category_id = categoryResult.rows[0].id;

        // Insert the new post with the retrieved category_id
        const result = await pool.query(
            `INSERT INTO posts (category_id, title, content, user_id) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [category_id, title, content, user_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to create a new thread to a post
app.post('/posts/:category/:postId/threads', async (req, res) => {
    const { category, postId } = req.params;
    const { content, user_id } = req.body;

    // Validate the required fields
    if (!content || !user_id) {
        return res.status(400).json({ message: 'Content and user_id are required' });
    }

    try {
        // Check if the category and post exist
        const categoryResult = await pool.query('SELECT * FROM category WHERE category = $1', [category]);
        if (categoryResult.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const postResult = await pool.query('SELECT * FROM posts WHERE id = $1 AND category_id = $2', [postId, categoryResult.rows[0].id]);
        if (postResult.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found in the specified category' });
        }

        // Insert the new thread
        const result = await pool.query(
            `INSERT INTO threads (post_id, content, user_id) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [postId, content, user_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

