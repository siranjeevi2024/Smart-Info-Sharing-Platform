# Smart Info Sharing Platform 🚀

A modern, full-stack MERN social platform for sharing knowledge, connecting with users, and building communities. Features real-time messaging, post management, and social interactions.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## ✨ Features

### Authentication & Authorization
- 🔐 Email/Password registration and login
- 🔑 Google OAuth 2.0 integration
- 🔒 JWT-based authentication
- 📧 Password reset via email
- 👤 User profile management

### Post Management
- ✍️ Create, edit, and delete posts
- 📂 Category-based organization (Technology, Science, Business, Education, Health, Other)
- 🏷️ Tag system for better discoverability
- 🔍 Advanced search functionality
- 📊 View tracking
- ❤️ Like/unlike posts
- 💬 Comment system
- 🔥 Trending posts algorithm
- 📌 Save posts for later

### Social Features
- 👥 Follow/unfollow users
- 💬 Real-time messaging with Socket.io
- 🖼️ Image sharing in messages
- 😊 Emoji support
- 🔔 Notifications system
- 📊 User statistics (followers, following, posts)

### Admin Dashboard
- 👨‍💼 User management
- 📝 Post moderation
- 📊 Platform analytics
- 🚫 User blocking/unblocking

## 🛠️ Tech Stack

### Frontend
- **React** 18.x - UI library
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **Socket.io-client** - Real-time communication
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **Passport.js** - OAuth strategies
- **Nodemailer** - Email service
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
mern-platform/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── passport.js        # Passport strategies
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── postController.js  # Post CRUD operations
│   │   ├── userController.js  # User management
│   │   ├── messageController.js # Messaging logic
│   │   └── adminController.js # Admin operations
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Post.js            # Post schema
│   │   ├── Message.js         # Message schema
│   │   └── Notification.js    # Notification schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── posts.js           # Post routes
│   │   ├── users.js           # User routes
│   │   ├── messages.js        # Message routes
│   │   └── admin.js           # Admin routes
│   ├── middleware/
│   │   └── auth.js            # JWT verification
│   ├── utils/
│   │   └── emailValidator.js  # Email validation
│   ├── .env.example           # Environment template
│   ├── server.js              # Entry point
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js      # Navigation bar
│   │   │   ├── PostCard.js    # Post display card
│   │   │   ├── Footer.js      # Footer component
│   │   │   └── UserStats.js   # User statistics
│   │   ├── pages/
│   │   │   ├── Home.js         # Home feed
│   │   │   ├── Login.js        # Login page
│   │   │   ├── Register.js     # Registration page
│   │   │   ├── Profile.js      # User profile
│   │   │   ├── CreatePost.js   # Post creation
│   │   │   ├── PostDetail.js   # Single post view
│   │   │   ├── Messages.js     # Messaging interface
│   │   │   ├── Trending.js     # Trending posts
│   │   │   ├── SavedPosts.js   # Saved posts
│   │   │   └── AdminDashboard.js # Admin panel
│   │   ├── context/
│   │   │   └── AuthContext.js  # Auth state management
│   │   ├── utils/
│   │   │   └── api.js          # Axios configuration
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone the repository
```bash
git clone https://github.com/siranjeevi2024/Smart-Info-Sharing-Platform.git
cd Smart-Info-Sharing-Platform
```

### Step 2: Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Start backend server
npm start
```

### Step 3: Frontend Setup
```bash
cd frontend
npm install

# Start frontend development server
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5002

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/smart-info-platform
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5002/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

### Getting Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5002/api/auth/google/callback`

### Getting Gmail App Password
1. Enable 2-Step Verification on your Google Account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use the 16-character password in `.env`

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/me                - Get current user
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password/:token - Reset password
GET    /api/auth/google            - Google OAuth login
```

### Posts
```
GET    /api/posts                  - Get all posts (with filters)
GET    /api/posts/:id              - Get single post
POST   /api/posts                  - Create post (auth required)
PUT    /api/posts/:id              - Update post (auth required)
DELETE /api/posts/:id              - Delete post (auth required)
POST   /api/posts/:id/like         - Like/unlike post (auth required)
POST   /api/posts/:id/comment      - Add comment (auth required)
GET    /api/posts/trending         - Get trending posts
```

### Users
```
GET    /api/users/:id              - Get user profile
PUT    /api/users/profile          - Update profile (auth required)
POST   /api/users/follow/:id       - Follow/unfollow user (auth required)
GET    /api/users/:id/posts        - Get user's posts
POST   /api/users/save/:postId     - Save/unsave post (auth required)
GET    /api/users/saved            - Get saved posts (auth required)
```

### Messages
```
GET    /api/messages/conversations - Get all conversations (auth required)
GET    /api/messages/:userId       - Get messages with user (auth required)
POST   /api/messages/:userId       - Send message (auth required)
```

### Admin
```
GET    /api/admin/users            - Get all users (admin only)
GET    /api/admin/posts            - Get all posts (admin only)
DELETE /api/admin/users/:id        - Delete user (admin only)
DELETE /api/admin/posts/:id        - Delete post (admin only)
```

## 🎨 Key Features Explained

### Real-time Messaging
- Socket.io enables instant message delivery
- Online/offline status tracking
- Typing indicators
- Image sharing support

### Trending Algorithm
Posts are ranked based on:
- View count (40% weight)
- Like count (30% weight)
- Comment count (20% weight)
- Recency (10% weight)

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Input validation
- XSS protection

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Siranjeevi**
- GitHub: [@siranjeevi2024](https://github.com/siranjeevi2024)

## 🙏 Acknowledgments

- MERN Stack community
- Socket.io documentation
- TailwindCSS team

---

⭐ Star this repository if you find it helpful!
