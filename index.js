// // index.js (yang paling luar)
// const express = require('express')
// const app = express()
// const port = 3001
// const connectDB = require('./connection')

// // === TAMBAHKAN BARIS INI UNTUK KONEKSI KE ATLAS ===
// connectDB();
// // Atau kalau bikin file connection.js, cukup panggil di sini.

// const ProductRoutes = require('./controllers')

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// app.use('/', ProductRoutes)

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

require('dotenv').config(); // import .env

const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const app = express();
const port = process.env.PORT || 3000;
// const port = 3000;
// const errorHandler = require('./middlewares/errorHandler')

// Connection
const connectDB = require('./connection');
connectDB();

// Session middleware (diperlukan untuk passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'rahasia-session',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true untuk HTTPS
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware for parsing JSON and form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(errorHandler);
app.use(express.static('public'));

// Routes
// const productRoutes = require('./controllers');
// app.use('/', productRoutes);
const productRoutes = require('./controllers');
const foodRoutes = require('./controllers/food');
const userRoutes = require('./controllers/userController');
const authRoutes = require('./controllers/authController');

app.use('/food', foodRoutes);       // foods
app.use('/user', userRoutes);      // user
app.use('/auth', authRoutes);      // Oauth
app.use('/', productRoutes);        // product

// Middleware error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Run Server
// app.listen(port, () => {
//   console.log(`App listening on port ${port}`)
// })
app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
