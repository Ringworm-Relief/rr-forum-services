CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    category VARCHAR(200),
    -- attributes JSONB DEFAULT [],
);

CREATE TABLE attributes (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(id),
    title VARCHAR(200),
    content TEXT DEFAULT '',
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    -- threads JSONB DEFAULT [],
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

SELECT U.UserID, U.Name, Roles.RoleID, Roles.RoleName  
FROM [dbo].[User] as U 
INNER JOIN [dbo].UserRole as UR ON UR.UserID=U.UserID 
INNER JOIN [dbo].RoleMaster as Roles ON Roles.RoleID=UR.RoleMasterID
FOR JSON AUTO

[
  {
    "UserID": 1,
    "Name": "XYZ",
    "Roles": [
      {
        "RoleID": 1,
        "RoleName": "Admin"
      }
    ]
  },
  {
    "UserID": 2,
    "Name": "PQR",
    "Roles": [
      {
        "RoleID": 1,
        "RoleName": "Admin"
      },
      {
        "RoleID": 2,
        "RoleName": "User"
      }
    ]
  },
  {
    "UserID": 3,
    "Name": "ABC",
    "Roles": [
      {
        "RoleID": 1,
        "RoleName": "Admin"
      }
    ]
  }
]

INSERT INTO posts (category) VALUES 
('Cleaning'),
('Treatment'),
('General');

INSERT INTO attributes (post_id, title, content, user_id) VALUES (1, 'title', 1);