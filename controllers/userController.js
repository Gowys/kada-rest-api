// const express = require('express');
// const router = express.Router();
// const User = require('../models/user');
// const jwt = require('jsonwebtoken');
// const { protect } = require('../middleware/auth'); // kita akan buat middleware

// // Generate JWT Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET || 'rahasia', {
//     expiresIn: '30d'
//   });
// };

// // @route   POST /users/register
// router.post('/register', async (req, res, next) => {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ message: 'Semua field harus diisi' });
//     }

//     const userExists = await User.findOne({ $or: [{ email }, { username }] });
//     if (userExists) {
//       return res.status(400).json({ message: 'Username atau email sudah terdaftar' });
//     }

//     const user = await User.create({ username, email, password });
//     const token = generateToken(user._id);

//     res.status(201).json({
//       message: 'Registrasi berhasil',
//       user: {
//         _id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role
//       },
//       token
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   POST /users/login
// router.post('/login', async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email dan password harus diisi' });
//     }

//     const user = await User.findOne({ email }).select('+password');
//     if (!user) {
//       return res.status(401).json({ message: 'Email atau password salah' });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Email atau password salah' });
//     }

//     const token = generateToken(user._id);

//     res.json({
//       message: 'Login berhasil',
//       user: {
//         _id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role
//       },
//       token
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// // @route   GET /users/profile (contoh route terproteksi)
// router.get('/profile', protect, async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id);
//     res.json({
//       user: {
//         _id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;

// userController.js
// import express from "express";
// import User from "../models/userModel.js";

// const router = express.Router();

// // router.get("/", (req, res) => {
// //   console.log("Route kepanggil");
// //   res.json({ message: "OK" });
// // });

// router.get("/", async (req, res, next) => {
//   try {
//     const user = await User.find();
//     res.status(200).json(user)
//   } catch (err) {
//     next(err);
//   }
// });

// router.post("/", (req, res, next) => {
//     const { email, password } = req.body || {};

//     User.create({ email, password })
//     .then(user => {
//         res.json(user);
//     })
//     .catch(err => {
//         next(err);
//     })
// })

// export default router;

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { compare } = require("../helpers/password");
const generateToken = require("../helpers/token");
const { sendEmail } = require('../helpers/email');
const crypto = require('crypto');

// REGISTER
router.post("/register", async (req, res, next) => {
  console.log("Register route hit"); //
  console.log("Body:", req.body); //
  try {
    const { email, password } = req.body;

    // Validasi sederhana (bisa ditambah)
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password wajib diisi" });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email sudah digunakan" });
    }

    // Buat user baru (password akan di-hash oleh middleware pre-save)
    const user = await User.create({ email, password });

    // Jangan kirim password ke client
    const userData = { id: user._id, email: user.email };

    res.status(201).json({
      message: "Registrasi berhasil",
      user: userData,
    });
  } catch (err) {
    next(err); // lanjut ke error handler
  }
  //   try {
  //     const { email, password } = req.body;
  //     console.log("Email:", email, "Password:", password);
  //     res.json({ message: "OK" });
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
});

// LOGIN
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password wajib diisi" });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Bandingkan password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Generate JWT
    const token = generateToken(user);

    res.json({
      message: "Login berhasil",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email wajib diisi' });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      // Untuk keamanan, tetap kasih respons sukses meskipun email tidak ditemukan
      // agar orang tidak bisa cek email mana yang terdaftar
      return res.json({ 
        message: 'Jika email terdaftar, link reset password akan dikirim' 
      });
    }

    // Generate token random
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Simpan token ke database (hash token untuk keamanan)
    // Sebenarnya bisa langsung simpan token, tapi lebih aman di-hash
    user.resetPasswordToken = resetToken; // simpan langsung untuk sederhana
    user.resetPasswordExpires = Date.now() + 3600000; // 1 jam

    await user.save();

    // Buat link reset password
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    // Template email
    const html = `
      <h1>Reset Password</h1>
      <p>Anda menerima email ini karena Anda (atau orang lain) meminta reset password.</p>
      <p>Klik link berikut untuk mereset password Anda:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Link ini berlaku selama 1 jam.</p>
      <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
    `;

    // Kirim email
    await sendEmail(user.email, 'Reset Password Request', html);

    res.json({ 
      message: 'Jika email terdaftar, link reset password akan dikirim' 
    });
  } catch (err) {
    next(err);
  }
});

// ========== RESET PASSWORD ==========
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token dan password baru wajib diisi' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }

    // Cari user dengan token yang valid dan belum expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token tidak valid atau sudah expired' });
    }

    // Update password
    user.password = newPassword; // Akan di-hash oleh pre-save hook
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    // Kirim email konfirmasi
    const html = `
      <h1>Password Berhasil Direset</h1>
      <p>Password Anda telah berhasil direset.</p>
      <p>Jika Anda tidak melakukan ini, segera hubungi admin.</p>
    `;
    await sendEmail(user.email, 'Password Berhasil Direset', html);

    res.json({ message: 'Password berhasil direset. Silakan login dengan password baru.' });
  } catch (err) {
    next(err);
  }
});

// router.get('/test', (req, res) => {
//   res.json({ message: 'User route ok' });
// });

module.exports = router;
