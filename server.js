const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;
app.use(express.json())

app.listen(port, () => {
    console.log(`Server on port ${port}`);
})

const pool = new Pool ({
    user: 'asherspurr',
    host: 'localhost',
    database: 'template1',
    password: 'mbs01864',
    port: 5432,
})

// Get all posts from a single category
app.get('/posts/:category', async (req, res) => {
    const category = req.params.category; // get category from url
    try {
        const result = await pool.query('SELECT * FROM attributes WHERE category = $1', [category]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving posts');
    }
})

app.get('/posts/:category/:id', async (req, res) => {
    const category = req.params.category; // get category from url
    const id = req.params.id; // get id from url

    try {
        const result = await pool.query('SELECT * FROM posts WHERE id = $1 AND category = $2', [id, category]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Post not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving post');
    }
})

app.post('/posts/:category', async (req, res) => {
    const { postId, newAttributes } = req.body;

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT attributes FROM attributes WHERE post_id = $1', [postId]);
        let currentAttributes = result.rows[0].attributes || [];

        currentAttributes.push(newAttributes);

        await client.query('UPDATE attributes SET attributes = $1 WHERE post_id = $2', [currentAttributes, postId]);

        client.release();
        res.status(200).send(currentAttributes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating post');
    }
})

module.exports = { pool };
