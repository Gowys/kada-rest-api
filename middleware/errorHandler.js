// const errorHandler = (err, req, res, next) => {
//     console.log(err)
//     next()
// }

// module.exports = errorHandler

const mongoose = require("mongoose");

const errorHandler = (err, req, res, next) => {
//   console.error("❌ Error Handler:", err);
  console.error(err.stack); // log error di terminal

  let status = 500;
  let message = "Terjadi kesalahan server";

  // Error validasi dari mongoose
  if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Error duplicate key (misal email sudah ada)
  if (err.code === 11000) {
    status = 409;
    message = "Email sudah digunakan";
  }

  // Error dari JWT
  res.status(status).json({ message });
};

module.exports = errorHandler;
