// const express = require('express')
// const router = express.Router()
// const Product = require('../models')

// router.get('/', (req, res) => {
//     Product.findAll()
//     .then(products => {
//         res.json(products)
//     })
//     .catch(err => {
//         res.json(err)
//     })
// })

// router.get('/:id', (req, res) => {
//     Product.findById(req.params.id)
//     .then(product => {
//         res.json(product)
//     })
//     .catch(err => {
//         res.json(err)
//     })
// })

// router.post('/', (req, res) => {
//     let { name, description, price, stock, image_url } = req.body

//     price = Number(price)
//     stock = Number(stock)

//     if (!name || !description || !price || !stock) {
//         new Error('All fields are required')
//     }

//     Product.create({name, description, price, stock, image_url})
//     .then(product => {
//         res.json(product)
//     })
//     .catch(err => {
//         res.json(err)
//     })
// })

// router.put('/:id', (req, res) => {
//     let { name, description, price, stock, image_url } = req.body

//     price = Number(price)
//     stock = Number(stock)

//     if (!name || !description || !price || !stock) {
//         new Error('All fields are required')
//     }

//     Product.update(req.params.id, {name, description, price, stock, image_url})
//     .then(product => {
//         res.json(product)
//     })
//     .catch(err => {
//         res.json(err)
//     })
// })

// router.delete('/:id', (req, res) => {
//     Product.delete(req.params.id)
//     .then(() => {
//         res.json({ message: `Product with id ${req.params.id} has been deleted`})
//         })
//     .catch(err => {
//         res.json(err)
//     })
// })

// module.exports = router;

// //ganti
// const express = require('express')
// const router = express.Router()
// // Panggil MODEL Product yang udah kita buat
// const Product = require('../models')

// // GET / (Baca semua produk)
// router.get('/', async (req, res) => {
//     try {
//         const products = await Product.find({}); // Method Mongoose untuk ambil semua
//         res.json(products);
//     } catch (err) {
//         res.json(err);
//     }
// });

// // GET /:id (Baca produk berdasarkan ID)
// router.get('/:id', async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id); // Method Mongoose cari berdasarkan ID
//         res.json(product);
//     } catch (err) {
//         res.json(err);
//     }
// });

// // POST / (Buat produk baru)
// router.post('/', async (req, res) => {
//     let { name, description, price, stock, image_url } = req.body;

//     // Validasi sederhana
//     if (!name || !description || !price || !stock) {
//         return res.status(400).json({ message: 'Semua field (name, description, price, stock) wajib diisi' });
//     }

//     try {
//         const newProduct = await Product.create({ // Method Mongoose untuk buat baru
//             name,
//             description,
//             price: Number(price),
//             stock: Number(stock),
//             image_url
//         });
//         res.status(201).json(newProduct); // 201 = Created
//     } catch (err) {
//         res.json(err);
//     }
// });

// // PUT /:id (Update produk)
// router.put('/:id', async (req, res) => {
//     let { name, description, price, stock, image_url } = req.body;

//     if (!name || !description || !price || !stock) {
//         return res.status(400).json({ message: 'Semua field (name, description, price, stock) wajib diisi' });
//     }

//     try {
//         const updatedProduct = await Product.findByIdAndUpdate(
//             req.params.id, // ID yang mau di-update
//             { // Data baru
//                 name,
//                 description,
//                 price: Number(price),
//                 stock: Number(stock),
//                 image_url
//             },
//             { new: true } // Opsi ini biar yang dikembalikan adalah data setelah di-update
//         );
//         if (!updatedProduct) {
//             return res.status(404).json({ message: 'Produk tidak ditemukan' });
//         }
//         res.json(updatedProduct);
//     } catch (err) {
//         res.json(err);
//     }
// });

// // DELETE /:id (Hapus produk)
// router.delete('/:id', async (req, res) => {
//     try {
//         const deletedProduct = await Product.findByIdAndDelete(req.params.id);
//         if (!deletedProduct) {
//             return res.status(404).json({ message: 'Produk tidak ditemukan' });
//         }
//         res.json({ message: `Product dengan id ${req.params.id} telah dihapus` });
//     } catch (err) {
//         res.json(err);
//     }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Product = require("../models"); // import model Product

// ========== CREATE (POST) ==========
router.post("/", async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body;

    // Validasi manual (sebenarnya sudah di schema, tapi untuk keamanan ekstra)
    if (!name || !description || !price || !stock) {
      return res
        .status(400)
        .json({
          message: "Semua field wajib diisi (name, description, price, stock)",
        });
    }

    const newProduct = await Product.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      image_url: image_url || "https://via.placeholder.com/150",
    });

    res.status(201).json({
      message: "Produk berhasil ditambahkan",
      product: newProduct,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== READ ALL (GET) ==========
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({
      count: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== READ ONE (GET by ID) ==========
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    res.json(product);
  } catch (err) {
    // Jika ID tidak valid (misal panjangnya salah)
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "ID produk tidak valid" });
    }
    res.status(500).json({ error: err.message });
  }
});

// ========== UPDATE (PUT) ==========
router.put("/:id", async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body;

    // Validasi field wajib
    if (!name || !description || !price || !stock) {
      return res
        .status(400)
        .json({
          message: "Semua field wajib diisi (name, description, price, stock)",
        });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        image_url: image_url || "https://via.placeholder.com/150",
      },
      { new: true, runValidators: true }, // new: kembalikan data setelah update, runValidators: jalankan validasi schema
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json({
      message: "Produk berhasil diupdate",
      product: updatedProduct,
    });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "ID produk tidak valid" });
    }
    res.status(500).json({ error: err.message });
  }
});

// ========== DELETE (DELETE) ==========
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    res.json({ message: `Produk dengan id ${req.params.id} telah dihapus` });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "ID produk tidak valid" });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
