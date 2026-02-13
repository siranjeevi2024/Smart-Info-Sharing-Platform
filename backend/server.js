require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users'));

// Socket.io
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('userOnline', async (userId) => {
    const User = require('./models/User');
    await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: Date.now() });
    io.emit('userStatusChanged', { userId, isOnline: true });
  });

  socket.on('disconnect', async () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Info Platform API' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});