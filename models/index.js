// const fs = require('fs').promises;
// const path = require('path');
// const filePath = path.join(__dirname, '../data.json');

// const dataModel =  {
//     findAll: async () => {
//         const content = await fs.readFile(filePath, 'utf-8');
//         return JSON.parse(content);
//     },
//     findById: async (id) => {
//         const content = await fs.readFile(filePath, 'utf-8');
//         const products = JSON.parse(content);
//         // for (let i=0; i<products.length; i++) {
//         //     if (products[i].id == id) {
//         //         return products[i];
//         //     }
//         // }
//         const product = products.find(product => product.id == id);
//         return product;
//     },
//     create: async (newProduct) => {
//         const file = await fs.readFile(filePath, 'utf-8');
//         const products = JSON.parse(file);

//         const id = products[products.length - 1].id + 1;
//         newProduct.id = id;
//         products.push(newProduct);

//         await fs.writeFile(filePath, JSON.stringify(products, null, 2));
//         return newProduct
//     },   
//     update: async (id, updatedProduct) => {
//         // read the data
//         const file = await fs.readFile(filePath, 'utf-8');
//         const products = JSON.parse(file);

//         // choose the data that need to be updated
//         const product = products.find(product => product.id == id);

//         // replace the current data with new value
//         product.name = updatedProduct.name;
//         product.description = updatedProduct.description;
//         product.price = updatedProduct.price;
//         product.stock = updatedProduct.stock;
//         product.image_url = updatedProduct.image_url;  

//         // write the data inside data.json
//         await fs.writeFile(filePath, JSON.stringify(products, null, 2));

//         // return new data to the user
//         return updatedProduct;
//     },  
//     delete: async (id) => {
//         // read the data
//         const content = await fs.readFile(filePath, 'utf-8');
//         const products = JSON.parse(content);

//         if (id < 1) {
//             return new Error('Invalid id');
//         }

//         // delete the data from array json
//         const index = products.findIndex(product => product.id == id);
//         console.log(index)

//         products.splice(index, 1);

//         // write the data inside data.json
//         await fs.writeFile(filePath, JSON.stringify(products, null, 2));
//         return undefined;
//     }
// }

// module.exports = dataModel;

// // models/index.js
// const mongoose = require('mongoose');

// // 1. DEFINISIKAN SCHEMA (Cetakan Product)
// // Ini ngikutin struktur data.json kamu sebelumnya
// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Nama produk harus diisi'] // Validasi dari materi PDF halaman 33
//   },
//   description: {
//     type: String,
//     required: [true, 'Deskripsi produk harus diisi']
//   },
//   price: {
//     type: Number,
//     required: [true, 'Harga produk harus diisi']
//   },
//   stock: {
//     type: Number,
//     required: [true, 'Stok produk harus diisi']
//   },
//   image_url: {
//     type: String
//   }
// }, {
//   timestamps: true // Ini bakal otomatis nambahin createdAt dan updatedAt (PDF halaman 29)
// });

// // 2. BUAT MODEL dari Schema
// // Model ini yang akan kita gunakan untuk query CRUD
// const Product = mongoose.model('Product', productSchema);

// // 3. EXPORT MODEL
// module.exports = Product;

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama produk harus diisi']
  },
  description: {
    type: String,
    required: [true, 'Deskripsi produk harus diisi']
  },
  price: {
    type: Number,
    required: [true, 'Harga produk harus diisi']
  },
  stock: {
    type: Number,
    required: [true, 'Stok produk harus diisi']
  },
  image_url: {
    type: String,
    default: 'https://via.placeholder.com/150' // optional
  }
}, {
  timestamps: true // otomatis tambah createdAt dan updatedAt
});

// Membuat model dari schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;