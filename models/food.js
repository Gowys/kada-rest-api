// const mongoose = require('mongoose');

// const foodSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Nama makanan harus diisi']
//   },
//   description: {
//     type: String,
//     required: [true, 'Deskripsi makanan harus diisi']
//   },
//   price: {
//     type: Number,
//     required: [true, 'Harga makanan harus diisi']
//   },
//   category: {
//     type: String,
//     enum: ['makanan', 'minuman', 'snack', 'dessert'],
//     default: 'makanan'
//   },
//   isAvailable: {
//     type: Boolean,
//     default: true
//   },
//   image_url: {
//     type: String,
//     default: 'https://via.placeholder.com/150'
//   }
// }, {
//   timestamps: true
// });

// const Food = mongoose.model('Food', foodSchema);

// module.exports = Food;

const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama makanan harus diisi']
  },
  description: {
    type: String,
    required: [true, 'Deskripsi makanan harus diisi']
  },
  price: {
    type: Number,
    required: [true, 'Harga makanan harus diisi']
  },
  category: {
    type: String,
    enum: ['makanan', 'minuman', 'snack', 'dessert'],
    default: 'makanan'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  image_url: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // referensi ke model User
    required: true
  }
}, {
  timestamps: true
});

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;