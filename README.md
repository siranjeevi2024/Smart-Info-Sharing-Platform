# Smart Info Sharing Platform

A full-stack MERN application for sharing knowledge and connecting with users.

## Features

- User authentication (Email/Password & Google OAuth)
- Create, edit, and delete posts
- Real-time messaging with Socket.io
- Follow/unfollow users
- Like and comment on posts
- Trending posts
- Category filtering
- Search functionality

## Tech Stack

- **Frontend**: React, TailwindCSS, Socket.io-client
- **Backend**: Node.js, Express, MongoDB, Socket.io
- **Authentication**: JWT, Passport.js

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Environment Variables

See `backend/.env.example` for required environment variables.

## License

MIT
