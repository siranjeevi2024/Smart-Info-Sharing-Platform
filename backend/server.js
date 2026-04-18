require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const helmet = require('helmet');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const {
  globalLimiter, authLimiter, postLimiter, aiLimiter,
  sanitizeInput, xssProtection, hppProtection, jsonLimiter, securityLogger
} = require('./middleware/security');

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const parseOrigin = (value) => {
  try {
    return new URL(value);
  } catch (error) {
    return null;
  }
};

const matchesAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  const requestUrl = parseOrigin(origin);
  if (!requestUrl) {
    return false;
  }

  return allowedOrigins.some((allowedOrigin) => {
    const allowedUrl = parseOrigin(allowedOrigin);
    if (!allowedUrl) {
      return false;
    }

    if (allowedUrl.origin === requestUrl.origin) {
      return true;
    }

    // Allow Vercel preview deployments for the same project slug.
    if (
      allowedUrl.protocol === 'https:' &&
      requestUrl.protocol === 'https:' &&
      allowedUrl.hostname.endsWith('.vercel.app') &&
      requestUrl.hostname.endsWith('.vercel.app')
    ) {
      const allowedProject = allowedUrl.hostname.replace(/\.vercel\.app$/, '');
      return (
        requestUrl.hostname === allowedUrl.hostname ||
        requestUrl.hostname.startsWith(`${allowedProject}-`)
      );
    }

    return false;
  });
};

const corsOptions = {
  origin: (origin, callback) => {
    if (matchesAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
};

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: corsOptions
});

app.set('trust proxy', 1);

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(globalLimiter);
app.use(sanitizeInput);
app.use(xssProtection);
app.use(hppProtection);
app.use(jsonLimiter);
app.use(securityLogger);
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ai', aiLimiter, require('./routes/ai'));

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

const PORT = process.env.PORT || 5002;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
