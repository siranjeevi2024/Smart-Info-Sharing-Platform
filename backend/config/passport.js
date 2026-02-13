const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { isTemporaryEmail } = require('../utils/emailValidator');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        
        if (isTemporaryEmail(email)) {
          return done(new Error('Temporary email addresses are not allowed'), null);
        }

        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        let existingUser = await User.findOne({ email });

        if (existingUser) {
          existingUser.googleId = profile.id;
          existingUser.avatar = profile.photos[0]?.value;
          await existingUser.save();
          return done(null, existingUser);
        }

        user = await User.create({
          googleId: profile.id,
          username: profile.displayName.replace(/\s+/g, '_').toLowerCase() + '_' + Date.now(),
          email,
          avatar: profile.photos[0]?.value
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;