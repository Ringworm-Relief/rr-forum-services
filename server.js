const express = require("express");
const { Pool } = require("pg"); // Ensure you import Pool from pg module
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Load environment variables from .env file
require("dotenv").config();

// Update your server file to detect the environment:
const environment = process.env.NODE_ENV || 'development';


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
  methods: "GET,POST,DELETE,PUT",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));

// Endpoint to fetch posts and their threads by category
app.get("/threads/:category", async (req, res) => {
  const category = req.params.category; // Get the category from the request parameters

  try {
    const { rows } = await db_session.query(
      `
            SELECT 
                t.id AS id,
                t.category AS category,
                t.title AS title,
                t.root_content AS root_content,
                t.user_id AS user_id,
                t.first_name AS first_name,
                t.last_name AS last_name,
                t.up_votes AS up_votes,
                t.down_votes AS down_votes,
                t.created_at AS created_at,
                COALESCE(json_agg(json_build_object(
                    'id', p.id,
                    'thread_id', p.thread_id,
                    'post_content', p.content,
                    'user_id', p.user_id,
                    'first_name', p.first_name,
                    'last_name', p.last_name,
                    'up_votes', p.up_votes,
                    'down_votes', p.down_votes,
                    'created_at', p.created_at
    )) FILTER (WHERE p.id IS NOT NULL), '[]')AS posts
            FROM 
                threads t
            LEFT JOIN 
                posts p ON t.id = p.thread_id
            WHERE 
                t.category = $1
            GROUP BY
            t.id, t.category, t.title, t.root_content, t.user_id, t.created_at
            ;
        `,
      [category]
    ); // Use the category from the request parameters
    if (rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// new endpoint for getting a thread by id
app.get("/threads/:category/:id", async (req, res) => {
  const { id, category } = req.params; // Get the category, postId, and threadId from the request parameters
  try {
    const { rows } = await db_session.query(
      `
            SELECT
                t.id AS id,
                t.category AS category,
                t.title AS title,
                t.root_content AS root_content,
                t.user_id AS user_id,
                t.first_name AS first_name,
                t.last_name AS last_name,
                t.up_votes AS up_votes,
                t.down_votes AS down_votes,
                t.created_at AS created_at,
                COALESCE(json_agg(json_build_object(
                    'id', p.id,
                    'thread_id', p.thread_id,
                    'post_content', p.content,
                    'user_id', p.user_id,
                    'first_name', p.first_name,
                    'last_name', p.last_name,
                    'up_votes', p.up_votes,
                    'down_votes', p.down_votes,
                    'created_at', p.created_at
                )) FILTER (WHERE p.id IS NOT NULL), '[]')AS posts
            FROM 
                threads t
            LEFT JOIN 
                posts p ON t.id = p.thread_id
            WHERE 
                t.id = $1 AND t.category = $2
            GROUP BY
            t.id, t.category, t.title, t.root_content, t.user_id, t.created_at
            ;
        `,
      [id, category]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Thread not found" });
    }
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Route to create a new post
app.post("/threads/create", async (req, res) => {
  const { title, root_content, user_id, category, up_votes, down_votes, first_name, last_name } =
    req.body; // Get other required fields from the request body
  // Validate the required fields
  if (!category || !title || !user_id || !root_content || !first_name || !last_name) {
    return res
      .status(400)
      .json({ message: "Category, title, content, first_name, and last_name, and user_id are required." });
  }

  try {
    // Insert the new post with the retrieved category_id
    const { rows } = await db_session.query(
      `INSERT INTO threads (category, title, root_content, user_id, up_votes, down_votes, first_name, last_name) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             ON CONFLICT (category, title, user_id) 
             DO UPDATE SET 
               root_content = EXCLUDED.root_content,
               up_votes = EXCLUDED.up_votes,
               down_votes = EXCLUDED.down_votes
             RETURNING *`,
      [category, title, root_content, user_id, up_votes, down_votes, first_name, last_name]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(201).json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Route to create a new post to a thread
app.post("/posts/create/:threadId", async (req, res) => {
  const { threadId } = req.params;
  const { content, user_id, up_votes, down_votes, first_name, last_name } = req.body;

  if (!content || !user_id || !first_name || !last_name) {
    res.status(400).json("Content, first_name, last_name and user_id are required in the body");
  }
  if (!threadId) {
    res.status(400).json("ThreadId is a required parameter");
  }

  try {
    // Check if the thread exists
    const threadResult = await db_session.query(
      "SELECT * FROM threads WHERE id = $1",
      [threadId]
    );
    if (threadResult.rows.length === 0) {
      res.status(404).json("Thread not found");
    }
    // Insert the new post with the retrieved category_id
    const { rows } = await db_session.query(
      `INSERT INTO posts (thread_id, content, user_id, up_votes, down_votes, first_name, last_name)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
      [threadId, content, user_id, up_votes, down_votes, first_name, last_name]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Thread not found" });
    }
    res.status(201).json(rows);
  } catch {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.delete("/threads/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json("ThreadId is a required parameter");
  }

  try {
    const { rows } = await db_session.query(
      "DELETE FROM threads WHERE id = $1 RETURNING *",
      [id]
    );
    if (!rows.length) {
      res.status(404).json({ message: "Thread not found." });
    } else {
      res
        .status(200)
        .json({ message: "Thread deleted successfully", thread: rows });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json("PostId is a required parameter");
  }

  try {
    const { rows } = await db_session.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [id]
    );

    if (!rows.length) {
      res.status(404).json({ message: "Post not found." });
    } else {
      res
        .status(200)
        .json({ message: "Post deleted successfully", post: rows });
    }
  } catch {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// // Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
