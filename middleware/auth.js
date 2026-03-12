// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// exports.protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     return res.status(401).json({ message: 'Anda tidak memiliki akses, silakan login' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rahasia');
//     req.user = await User.findById(decoded.id).select('-password');
//     if (!req.user) {
//       return res.status(401).json({ message: 'User tidak ditemukan' });
//     }
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Token tidak valid atau sudah kadaluarsa' });
//   }
// };

// // Middleware untuk role (opsional)
// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: 'Anda tidak memiliki izin' });
//     }
//     next();
//   };
// };

const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'fallback-secret-jangan-pakai-ini';

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Tidak ada token authorization' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Format token salah' });
    }

    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // decoded berisi { id, email, role }
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

module.exports = auth;