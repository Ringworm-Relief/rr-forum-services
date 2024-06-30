const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
app.use(express.json())

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})

const pool = new Pool ({
    user: 'asherspurr',
    host: 'localhost',
    database: 'ringwormForum',
    password: 'mbs01864',
    port: 5432,
})

const corsOptions = {
  origin: [/^http:\/\/localhost:\d+$/, "https://rr-as.vercel.app/"],
  methods: 'GET,POST',          
  allowedHeaders: 'Content-Type,Authorization', 
};

app.use(cors(corsOptions));

app.locals.posts = [
    {
      "id": "1",
      "type": "cleaning",
      "attributes": [
        {
          "id": "1",
          "title": "How to clean hardwood floors?",
          "content": "What's the best way to clean and maintain hardwood floors?",
          "user_id": "user1",
          "created_at": "2024-06-10T08:30:00Z",
          "threads": [
            {
              "id": "thread1",
              "content": "I use a mixture of vinegar and water. Works great!",
              "user_id": "user2",
              "created_at": "2024-06-10T09:00:00Z"
            },
            {
              "id": "thread2",
              "content": "Make sure not to use too much water, it can damage the wood.",
              "user_id": "user3",
              "created_at": "2024-06-10T09:15:00Z"
            }
          ]
        },
        {
          "id": "2",
          "title": "Best products for cleaning windows?",
          "content": "What are some recommended products for streak-free window cleaning?",
          "user_id": "user4",
          "created_at": "2024-06-11T10:00:00Z",
          "threads": [
            {
              "id": "thread1",
              "content": "I always use Windex, never fails!",
              "user_id": "user5",
              "created_at": "2024-06-11T10:30:00Z"
            },
            {
              "id": "thread2",
              "content": "Try using newspaper instead of paper towels for wiping.",
              "user_id": "user6",
              "created_at": "2024-06-11T10:45:00Z"
            }
          ]
        }
      ]
    },
    {
      "id": "2",
      "type": "treatment",
      "attributes": [
        {
          "id": "1",
          "title": "Effective remedies for headaches?",
          "content": "What are some quick ways to get rid of a headache?",
          "user_id": "user7",
          "created_at": "2024-06-12T11:00:00Z",
          "threads": [
            {
              "id": "thread1",
              "content": "I find that drinking water and resting in a dark room helps.",
              "user_id": "user8",
              "created_at": "2024-06-12T11:30:00Z"
            },
            {
              "id": "thread2",
              "content": "Peppermint oil on the temples works wonders for me.",
              "user_id": "user9",
              "created_at": "2024-06-12T11:45:00Z"
            }
          ]
        },
        {
          "id": "2",
          "title": "Home treatments for cold sores?",
          "content": "Any tips on how to quickly heal cold sores?",
          "user_id": "user10",
          "created_at": "2024-06-13T12:00:00Z",
          "threads": [
            {
              "id": "thread1",
              "content": "Applying aloe vera gel can help soothe and heal faster.",
              "user_id": "user11",
              "created_at": "2024-06-13T12:30:00Z"
            },
            {
              "id": "thread2",
              "content": "Lysine supplements have been effective for me.",
              "user_id": "user12",
              "created_at": "2024-06-13T12:45:00Z"
            }
          ]
        }
      ]
    },
    {
      "id": "3",
      "type": "general",
      "attributes": [
        {
          "id": "1",
          "title": "Best books to read in 2024?",
          "content": "Any recommendations for must-read books this year?",
          "user_id": "user13",
          "created_at": "2024-06-14T13:00:00Z",
          "threads": [
            {
              "id": "thread1",
              "content": "I loved 'The Silent Patient' by Alex Michaelides.",
              "user_id": "user14",
              "created_at": "2024-06-14T13:30:00Z"
            },
            {
              "id": "thread2",
              "content": "Try 'Where the Crawdads Sing' by Delia Owens.",
              "user_id": "user15",
              "created_at": "2024-06-14T13:45:00Z"
            }
          ]
        },
        {
          "id": "2",
          "title": "Tips for a successful garden?",
          "content": "What are some tips for maintaining a healthy garden?",
          "user_id": "user16",
          "created_at": "2024-06-15T14:00:00Z",
          "threads": [
            {
              "id": "thread1",
              "content": "Regular watering and weeding are key.",
              "user_id": "user17",
              "created_at": "2024-06-15T14:30:00Z"
            },
            {
              "id": "thread2",
              "content": "Use compost to enrich your soil.",
              "user_id": "user18",
              "created_at": "2024-06-15T14:45:00Z"
            }
          ]
        }
      ]
    }
]

//Get all posts from single category
app.get('/posts/:category', (req, res) => {
    const category = req.params.category; //get category from url

    const allPosts = app.locals.posts
    const gottenPosts = allPosts.filter(post => post.category === category)


    response.json({ gottenPosts })
})

app.get('/posts/:category/:id', (req, res) => {
    const category = req.params.category; //get category from url
    const id = req.params.id; //get id from url

    //Change to use database posts
    const post = posts.find(post => post.id === id && post.category === category);

    if(post) {
        res.json(post);
    } else {
        res.status(404).send('Post not found');
    }
})

app.post('/posts/:category', async (req, res) => {
    const newPost = req.body;

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT attributes FROM attributes WHERE post_id ')
    }
})

module.exports = { pool };
