// const express = require('express');
// const router = express.Router();
// const Food = require('../models/food');

// // CREATE - POST /food
// router.post('/', async (req, res) => {
//   try {
//     const { name, description, price, category, isAvailable, image_url } = req.body;

//     if (!name || !description || !price) {
//       return res.status(400).json({ message: 'Nama, deskripsi, dan harga wajib diisi' });
//     }

//     const newFood = await Food.create({
//       name,
//       description,
//       price: Number(price),
//       category,
//       isAvailable,
//       image_url: image_url || 'https://via.placeholder.com/150'
//     });

//     res.status(201).json({
//       message: 'Makanan berhasil ditambahkan',
//       food: newFood
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // READ ALL - GET /food
// router.get('/', async (req, res) => {
//   try {
//     const foods = await Food.find({});
//     res.json({
//       count: foods.length,
//       foods
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // READ ONE - GET /food/:id
// router.get('/:id', async (req, res) => {
//   try {
//     const food = await Food.findById(req.params.id);
//     if (!food) {
//       return res.status(404).json({ message: 'Makanan tidak ditemukan' });
//     }
//     res.json(food);
//   } catch (err) {
//     if (err.kind === 'ObjectId') {
//       return res.status(400).json({ message: 'ID tidak valid' });
//     }
//     res.status(500).json({ error: err.message });
//   }
// });

// // UPDATE - PUT /food/:id
// router.put('/:id', async (req, res) => {
//   try {
//     const { name, description, price, category, isAvailable, image_url } = req.body;

//     if (!name || !description || !price) {
//       return res.status(400).json({ message: 'Nama, deskripsi, dan harga wajib diisi' });
//     }

//     const updatedFood = await Food.findByIdAndUpdate(
//       req.params.id,
//       {
//         name,
//         description,
//         price: Number(price),
//         category,
//         isAvailable,
//         image_url
//       },
//       { new: true, runValidators: true }
//     );

//     if (!updatedFood) {
//       return res.status(404).json({ message: 'Makanan tidak ditemukan' });
//     }

//     res.json({
//       message: 'Makanan berhasil diperbarui',
//       food: updatedFood
//     });
//   } catch (err) {
//     if (err.kind === 'ObjectId') {
//       return res.status(400).json({ message: 'ID tidak valid' });
//     }
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE - DELETE /food/:id
// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedFood = await Food.findByIdAndDelete(req.params.id);
//     if (!deletedFood) {
//       return res.status(404).json({ message: 'Makanan tidak ditemukan' });
//     }
//     res.json({ message: `Makanan dengan id ${req.params.id} telah dihapus` });
//   } catch (err) {
//     if (err.kind === 'ObjectId') {
//       return res.status(400).json({ message: 'ID tidak valid' });
//     }
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Food = require('../models/food');
const auth = require('../middleware/auth'); // import middleware
const isAdmin = require('../middleware/isAdmin');

// ========== PUBLIC ROUTES (TIDAK PERLU TOKEN) ==========

// GET semua food (public)
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find({}).populate('userId', 'email');
    res.json({
      count: foods.length,
      foods
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET satu food by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('userId', 'email');
    if (!food) {
      return res.status(404).json({ message: 'Makanan tidak ditemukan' });
    }
    res.json(food);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID tidak valid' });
    }
    res.status(500).json({ error: err.message });
  }
});

// ========== PROTECTED ROUTES (HARUS LOGIN) ==========

// CREATE - POST /food (user biasa & admin)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, image_url } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ message: 'Nama, deskripsi, dan harga wajib diisi' });
    }

    // Ambil userId dari token (req.user)
    const newFood = await Food.create({
      name,
      description,
      price: Number(price),
      category: category || 'makanan',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      image_url: image_url || 'https://via.placeholder.com/150',
      userId: req.user.id // SIMPAN USER ID DARI TOKEN
    });

    res.status(201).json({
      message: 'Makanan berhasil ditambahkan',
      food: newFood
    });
  } catch (err) {
    console.error('Error create food:', err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - PUT /food/:id (hanya pemilik atau admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, image_url } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ message: 'Nama, deskripsi, dan harga wajib diisi' });
    }

    // Cari food yang akan diupdate
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ message: 'Makanan tidak ditemukan' });
    }

    // CEK OTORISASI: apakah user ini pemiliknya atau admin?
    if (food.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Anda tidak memiliki akses untuk mengubah makanan ini' });
    }

    // Update food
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: Number(price),
        category,
        isAvailable,
        image_url
      },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Makanan berhasil diperbarui',
      food: updatedFood
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID tidak valid' });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE - DELETE /food/:id (hanya pemilik atau admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Cari food yang akan dihapus
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ message: 'Makanan tidak ditemukan' });
    }

    // CEK OTORISASI: apakah user ini pemiliknya atau admin?
    if (food.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Anda tidak memiliki akses untuk menghapus makanan ini' });
    }

    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: `Makanan dengan id ${req.params.id} telah dihapus` });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID tidak valid' });
    }
    res.status(500).json({ error: err.message });
  }
});

// ========== ADMIN ONLY ROUTES ==========

// GET semua food dengan filter (admin only)
router.get('/admin/all', auth, isAdmin, async (req, res) => {
  try {
    const foods = await Food.find({}).populate('userId', 'email');
    res.json({
      count: foods.length,
      foods
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET semua food milik user tertentu (admin only)
router.get('/admin/user/:userId', auth, isAdmin, async (req, res) => {
  try {
    const foods = await Food.find({ userId: req.params.userId }).populate('userId', 'email');
    res.json({
      count: foods.length,
      foods
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;