const environment = process.env.NODE_ENV || 'development';

const database = require('knex')(configuration);
const express = require('express');
const app = express();
const cors = require('cors');

app.set('port', process.env.PORT || 3001)

// app.use(cors({ origin: 'https://housemate-hunter.vercel.app' }));
// app.use(cors({ origin: 'http://localhost:3002' }));

const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || /^http:\/\/localhost/.test(origin) || "deployed_url") {
        callback(null, true); 
      } else {
        callback(new Error('Not allowed by CORS')); 
      }
    },
  };
  
app.use(cors(corsOptions));

app.get('/forum/:category', async (request, response) => {
    const category = request.params.category 

    
    try {
        const category = await database('roommate').select();
        response.status(200).json(category);
    } catch(error) {
        response.status(500).json({error});
    }
});

app.get('/api/v1/roommates/:id', async (request, response) => {

    try {
        const roommates = await database('roommate').where('id', request.params.id).select();
        
        if(roommates.length){
            response.status(200).json(roommates);
        } else {
            response.status(404).json({
                error: `Could not find roommate with id ${request.params.id}`
            });
        }
    } catch (error) {
        response.status(500).json({error});
    }
});

app.listen(app.get('port'), () => {
    console.log(`App is running on http://localhost:${app.get('port')}.`);
  });


