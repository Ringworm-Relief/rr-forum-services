const express = require('express');
const { Pool } = require('pg'); // Ensure you import Pool from pg module
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Load environment variables from .env file
require('dotenv').config();

// Configure the connection db_session to PostgreSQL using environment variables
// const db_session = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// });

const db_session = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    }
});

app.use(express.json());

db_session.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

const corsOptions = {
  origin: [/^http:\/\/localhost:\d+$/, "https://rr-as.vercel.app/"],
  methods: 'GET,POST',          
  allowedHeaders: 'Content-Type,Authorization', 
};

app.use(cors(corsOptions));

// Endpoint to fetch posts and their threads by category
app.get('/threads/:category', async (req, res) => {
    const category = req.params.category; // Get the category from the request parameters
   
    try {
        const { rows } = await db_session.query(`
            SELECT 
                t.id AS id,
                t.category AS category,
                t.title AS title,
                t.root_content AS root_content,
                t.user_id AS user_id,
                t.created_at AS created_at,
                json_agg(json_build_object(
                    'id', p.id,
                    'thread_id', p.thread_id,
                    'post_content', p.content,
                    'user_id', p.user_id,
                    'created_at', p.created_at
                )) AS posts
            FROM 
                threads t
            LEFT JOIN 
                posts p ON t.id = p.thread_id
            WHERE 
                t.category = $1
            GROUP BY
            t.id, t.category, t.title, t.root_content, t.user_id, t.created_at
            ;
        `, [category]); // Use the category from the request parameters
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// new endpoint for getting a thread by id
app.get('/threads/:category/:id', async (req, res) => {
    const { id, category } = req.params; // Get the category, postId, and threadId from the request parameters
    try {
        const { rows } = await db_session.query(`
            SELECT
                t.id AS id,
                t.category AS category,
                t.title AS title,
                t.root_content AS root_content,
                t.user_id AS user_id,
                t.created_at AS created_at,
                json_agg(json_build_object(
                    'id', p.id,
                    'thread_id', p.thread_id,
                    'post_content', p.content,
                    'user_id', p.user_id,
                    'created_at', p.created_at
                )) AS posts
            FROM 
                threads t
            LEFT JOIN 
                posts p ON t.id = p.thread_id
            WHERE 
                t.id = $1 AND t.category = $2
            GROUP BY
            t.id, t.category, t.title, t.root_content, t.user_id, t.created_at
            ;
        `, [id, category]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Thread not found' });
        }
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to create a new post
app.post('/threads/create', async (req, res) => {
    
    const { title, root_content, user_id, category } = req.body; // Get other required fields from the request body
    // Validate the required fields
    if (!category || !title || !user_id || !root_content) {
        return res.status(400).json({ message: 'Category, title, content, and user_id are required.' });
    }

    try {
        // First, get the category_id from the category name
        
        // Insert the new post with the retrieved category_id
        const { rows } = await db_session.query(
            `INSERT INTO threads (category, title, root_content, user_id) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [category, title, root_content, user_id]
        );

        res.status(201).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to create a new post to a thread
// app.post('/threads/:threadId/create', async (req, res) => {
//     const { threadId } = req.params;
//     const { content, user_id } = req.body;

//     if (!content || !user_id) {
//         return res.status(400).json({ message: 'Content and user_id are required in the body' });
//     }
//     if(!threadId) {
//         return res.status(400).json({ message: 'ThreadId is a required parameter' });
//     }

//     try {

//     }
//     catch {

//     }
// })

// // Route to create a new thread to a post
// app.post('/posts/:category/:postId/threads', async (req, res) => {
//     const { category, postId } = req.params;
//     const { content, user_id } = req.body;

//     // Validate the required fields
//     if (!content || !user_id) {
//         return res.status(400).json({ message: 'Content and user_id are required' });
//     }

//     try {
//         // Check if the category and post exist
//         const categoryResult = await db_session.query('SELECT * FROM category WHERE category = $1', [category]);
//         if (categoryResult.rows.length === 0) {
//             return res.status(404).json({ message: 'Category not found' });
//         }

//         const postResult = await db_session.query('SELECT * FROM posts WHERE id = $1 AND category_id = $2', [postId, categoryResult.rows[0].id]);
//         if (postResult.rows.length === 0) {
//             return res.status(404).json({ message: 'Post not found in the specified category' });
//         }

//         // Insert the new thread
//         const result = await db_session.query(
//             `INSERT INTO threads (post_id, content, user_id) 
//              VALUES ($1, $2, $3) 
//              RETURNING *`,
//             [postId, content, user_id]
//         );

//         res.status(201).json(result.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// });

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});