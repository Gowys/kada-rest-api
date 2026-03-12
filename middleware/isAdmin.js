const isAdmin = (req, res, next) => {
  // req.user sudah di-set oleh middleware auth sebelumnya
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya untuk admin.' });
  }
  next();
};

module.exports = isAdmin;