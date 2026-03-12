// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: [true, 'Username harus diisi'],
//     unique: true,
//     trim: true,
//     minlength: [3, 'Username minimal 3 karakter']
//   },
//   email: {
//     type: String,
//     required: [true, 'Email harus diisi'],
//     unique: true,
//     lowercase: true,
//     match: [/^\S+@\S+\.\S+$/, 'Email tidak valid']
//   },
//   password: {
//     type: String,
//     required: [true, 'Password harus diisi'],
//     minlength: [6, 'Password minimal 6 karakter'],
//     select: false // agar password tidak ikut saat query kecuali diminta
//   },
//   role: {
//     type: String,
//     enum: ['user', 'admin'],
//     default: 'user'
//   }
// }, {
//   timestamps: true
// });

// // Encrypt password sebelum disimpan
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Method untuk membandingkan password
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// const User = mongoose.model('User', userSchema);
// module.exports = User;

// import mongoose, {schema} from 'mongoose';
// const ObjectId = Schema.ObjectId;
// import hash from '../helpers/password.js';

// const userSchema = new mongoose.Schema({
//   id:ObjectId,
//   email: {type: String, required:true},
//   password: {type: String, required:true}
// }, {timestamps: true});

// usersSchema.pre('save', async function(){
//   if(!this.isModified('password')) return
//   this.password = await hash(this.password)
// })

// const users = mongoose.model('users', userSchema);

// export default users;

// const mongoose = require('mongoose');
// const { hash } = require('../helpers/password');

// const UserSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: [true, 'Email wajib diisi'],
//     unique: true,
//     trim: true,
//     lowercase: true
//   },
//   password: {
//     type: String,
//     required: [true, 'Password wajib diisi'],
//     minlength: [6, 'Password minimal 6 karakter']
//   },
//   role: {
//     type: String,
//     enum: ['user', 'admin'],
//     default: 'user'
//   }
// }, { timestamps: true });

// // Pre-save hook: hash password sebelum disimpan
// UserSchema.pre('save', async function() {
//   if (!this.isModified('password')) return; // jika password tidak diubah, lewati
//   this.password = await hash(this.password); // hash password
// });

// const User = mongoose.model('User', UserSchema);
// module.exports = User;  

const mongoose = require('mongoose');
const { hash } = require('../helpers/password');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email wajib diisi'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi'],
    minlength: [6, 'Password minimal 6 karakter']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Fields untuk Google OAuth
  googleId: {
    type: String,
    unique: true,
    sparse: true // Membolehkan null/undefined
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  // Fields untuk password recovery
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Hash password sebelum disimpan
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await hash(this.password);
});

const User = mongoose.model('User', UserSchema);
module.exports = User;