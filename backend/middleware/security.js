const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Rate limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const postLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { error: 'Post limit reached. You can create up to 20 posts per hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'AI request limit reached. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Input sanitization - prevent NoSQL injection
const sanitizeInput = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized suspicious input in field: ${key}`);
  }
});

// XSS protection
const xssProtection = xss();

// HTTP Parameter Pollution protection
const hppProtection = hpp({
  whitelist: ['sort', 'category', 'search']
});

// Request size limiter
const jsonLimiter = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB (for base64 images)
  if (contentLength > MAX_SIZE) {
    return res.status(413).json({ error: 'Request too large' });
  }
  next();
};

// Security logger
const securityLogger = (req, res, next) => {
  const suspicious = [
    /<script/i, /javascript:/i, /on\w+=/i,
    /union.*select/i, /drop.*table/i, /insert.*into/i,
    /\$where/, /\$gt/, /\$lt/, /\$ne/
  ];
  const body = JSON.stringify(req.body || '');
  const query = JSON.stringify(req.query || '');
  const isSuspicious = suspicious.some(p => p.test(body) || p.test(query));
  if (isSuspicious) {
    console.warn(`⚠️  Suspicious request from ${req.ip} to ${req.path}`);
  }
  next();
};

module.exports = {
  globalLimiter,
  authLimiter,
  postLimiter,
  aiLimiter,
  sanitizeInput,
  xssProtection,
  hppProtection,
  jsonLimiter,
  securityLogger,
};
