const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

const getRequestOrigin = (req) => {
  const forwardedProto = req.get('x-forwarded-proto');
  const forwardedHost = req.get('x-forwarded-host');

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return `${req.protocol}://${req.get('host')}`;
};

const getGoogleCallbackUrl = (req) => {
  if (process.env.GOOGLE_CALLBACK_URL) {
    return process.env.GOOGLE_CALLBACK_URL.trim();
  }

  const requestOrigin = getRequestOrigin(req);

  if (requestOrigin) {
    return `${requestOrigin}/api/auth/google/callback`;
  }

  return 'http://localhost:5002/api/auth/google/callback';
};

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Google OAuth routes
router.get('/google',
  (req, res, next) => {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      callbackURL: getGoogleCallbackUrl(req)
    })(req, res, next);
  }
);

router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', {
      session: false,
      failureRedirect: '/login',
      callbackURL: getGoogleCallbackUrl(req)
    })(req, res, next);
  },
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

router.get('/google/debug', (req, res) => {
  res.json({
    callbackURL: getGoogleCallbackUrl(req),
    requestOrigin: getRequestOrigin(req),
    frontendURL: process.env.FRONTEND_URL
  });
});

module.exports = router;
