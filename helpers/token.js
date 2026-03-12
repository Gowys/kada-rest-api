// const jwt = require('jsonwebtoken');
// const secret = 'secret'

// const generateToken = (payload) => {
//     const token = jwt.sign(payload, secret);
//     return token
// }


// module.exports = generateToken

const jwt = require('jsonwebtoken');

// secret dari environment variable
const SECRET = process.env.JWT_SECRET || 'fallback-secret-jangan-pakai-ini';

const generateToken = (user) => {
  // user object berisi id, email, dan role
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};

module.exports = generateToken;