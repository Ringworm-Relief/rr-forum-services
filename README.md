# <p align="center">Users and Calendars Service</p>
<p align="center"> This is an API micro-service for the Ringworm Relief application, handling information for the application's forum. These responses currently do not follow any format.<p>

## Getting Started
### Environment variables
- `npm install dotenv`
- `create .env file in the root directory`
### Dependencies
- PostgreSQL
### Installation
1. `git clone {project}`
2. `cd {project}`
3. `npm install`
### Usage
Start the server with:
`node server.js`
### Base URL
https://ringworm-forum-0c0291e817b7.herokuapp.com

## <p align="center">Forum Endpoints</p>

### GET all Threads from category
```
POST "/threads/:category"
```

<details>
  <summary>Successful Response - 201</summary>

  Parameters: `category` <br>

  Response Body:

  ```json

  ```

</details>

</details>


### POST new thread
```
POST "/threads/create"
```

<details>
  <summary>Successful Response - 201</summary>

Parameters: `none` <br>
Request Body:
```json

{
  "category": "General",
  "title": "I am a title",
  "root_content": "<h1>I have a question</h1><p>How does ringworm spread?</p>",
  "first_name": "John".
  "last_name": "Doe",
  "user_id": "2",
  "up_votes": "0",
  "down_votes": "0"
}
```

Response:
```json
Code: 201
Status: OK

{
  "id": "5",
  "category": "General",
  "title": "I am a title",
  "root_content": "<h1>I have a question</h1><p>How does ringworm spread?</p>",
  "first_name": "John".
  "last_name": "Doe",
  "user_id": "2",
  "up_votes": "0",
  "down_votes": "0",
  "created_at": "Example Date",
  "posts": []
}
```
</details>


### GET Thread by id
```
GET "/threads/:category/:id"
```

<details>
  <summary>Successful Response - 200</summary>
  
Parameters: `None` <br>
Request Body: `None`
<br>
Response Body:
```json
Code: 200
Status: OK

{
  "id": "5",
  "category": "General",
  "title": "I am a title",
  "root_content": "<h1>I have a question</h1><p>How does ringworm spread?</p>",
  "first_name": "John".
  "last_name": "Doe",
  "user_id": "2",
  "up_votes": "0",
  "down_votes": "0",
  "created_at": "Example Date",
  "posts": []
}
```
</details>



### Create a new post

```
POST "/posts/create/:threadId"
```

<details>
  <summary>Successful Response</summary>

  Parameters: `threadId` <br>
  Request Body:
  ```json
  *content, user_id, first_last, last_name REQUIRED*

{
  "thread_id": "5",
  "content": "I am a comment",
  "user_id": "2",
  "up_votes": "0",
  "down_votes": "0",
  "first_name": "John",
  "last_name": "Doe"
}
  ```

  Response:

  ```json
  Code: 201
  Status: Created

{
  "id": "1",
  "thread_id": "5",
  "content": "I am a comment",
  "user_id": "2",
  "up_votes": "0",
  "down_votes": "0",
  "first_name": "John",
  "last_name": "Doe".
  "created_at": "UTC Date"
}
  ```
</details>

### UPDATE existing post votes

```
PUT "/posts/:id/:vote"
```

<details>
  <summary>Successful Response</summary>

  Parameters: `id` <br>
  Request Body:
  ```json
  *up_votes, down_votes REQUIRED*

{
  "up_votes": "1",
  "down_votes": "0"
}
  ```

  Response:

  ```json
  Code: 201
  Status: Created

{
  "id": "1",
  "thread_id": "5",
  "content": "I am a comment",
  "user_id": "2",
  "up_votes": "1",
  "down_votes": "0",
  "first_name": "John",
  "last_name": "Doe".
  "created_at": "UTC Date"
}
  ```
</details>

### DELETE Thread

```
DELETE "/threads/:id"
```

<details>
  <summary>Successful Response</summary>

  Parameters: `id` <br>

  Response:

  ```json
  Code: 200
  Status: Ok

{
  "message": {
    "thread deleted successfully"
  }
  "thread": {
    "id": "5",
    "category": "General",
    "title": "I am a title",
    "root_content": "<h1>I have a question</h1><p>How does ringworm spread?</p>",
    "first_name": "John".
    "last_name": "Doe",
    "user_id": "2",
    "up_votes": "0",
    "down_votes": "0",
    "created_at": "Example Date",
    "posts": []
}
}
  ```
</details>

### DELETE Post

```
DELETE "/posts/:id"
```

<details>
  <summary>Successful Response</summary>

  Parameters: `id` <br>

  Response:

  ```json
  Code: 200
  Status: Ok

{
  "message": {
    "Post deleted successfully"
  }
  "post": {
    "id": "1",
    "thread_id": "5",
    "content": "I am a comment",
    "user_id": "2",
    "up_votes": "0",
    "down_votes": "0",
    "first_name": "John",
    "last_name": "Doe",
    "created_at": "UTC date"
  }
}
  ```
</details>
