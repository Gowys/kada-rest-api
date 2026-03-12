const express = require('express');
const router = express.Router();
const passport = require('passport');
const generateToken = require('../helpers/token');

// Route untuk memulai autentikasi Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback setelah Google mengembalikan data user
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login?error=auth_failed',
    session: false // Kita tidak pakai session, kita pakai JWT
  }),
  (req, res) => {
    // Generate JWT token untuk user
    const token = generateToken({
      id: req.user._id,
      email: req.user.email,
      role: req.user.role
    });

    // Redirect ke frontend dengan token
    res.redirect(`${process.env.APP_URL}/oauth-success?token=${token}`);
  }
);

// Endpoint untuk mendapatkan user info dari token (opsional)
router.get('/me', (req, res) => {
  // Ini akan dipanggil setelah frontend menerima token
  res.json({ message: 'OAuth flow completed' });
});

module.exports = router;