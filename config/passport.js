const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Cek apakah user sudah ada berdasarkan googleId
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Cek apakah email sudah terdaftar dengan metode lain
          const email = profile.emails[0].value;
          user = await User.findOne({ email });

          if (user) {
            // User sudah ada dengan email ini tapi belum punya googleId
            user.googleId = profile.id;
            user.authProvider = 'google';
            await user.save();
          } else {
            // Buat user baru
            user = await User.create({
              email: profile.emails[0].value,
              googleId: profile.id,
              authProvider: 'google',
              role: 'user',
              // Password random (tidak akan dipakai karena authProvider = google)
              password: Math.random().toString(36).slice(-8) + 'Aa1!'
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;