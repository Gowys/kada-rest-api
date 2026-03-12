# ============================================
# STAGE 1: Menggunakan Node.js official image
# ============================================
FROM node:24-alpine
# FROM node:18-slim
# FROM node:18-bullseye

# ============================================
# SET WORKDIR - Ini jawaban pertanyaan kamu!
# ============================================
# WORKDIR ini akan menjadi folder utama aplikasi di dalam container
# Semua perintah selanjutnya akan dijalankan dari folder ini
WORKDIR /app

# ============================================
# COPY package files (dependencies dulu, untuk caching)
# ============================================
# Copy package.json dan package-lock.json
# Kita copy dulu file ini SEBELUM copy semua file
# Tujuannya: biar cache Docker bisa dimanfaatkan
COPY package*.json ./

# ============================================
# INSTALL DEPENDENCIES
# ============================================
# Install semua dependencies yang ada di package.json
# --production hanya install dependencies, bukan devDependencies
RUN npm ci --only=production

# ============================================
# COPY SOURCE CODE
# ============================================
# Setelah dependencies terinstall, baru copy semua source code
# Perhatikan: node_modules sudah di-.dockerignore, jadi tidak ikut dicopy
COPY . .

# ============================================
# ENVIRONMENT VARIABLES
# ============================================
# Ini jawaban pertanyaan kamu soal ENV!
# Ada 2 cara:

# CARA 1: Set ENV langsung di Dockerfile (TIDAK DIREKOMENDASIKAN untuk password)
# ENV PORT=5000
# ENV MONGODB_URI=mongodb://localhost:27017/kada_db
# ENV JWT_SECRET=rahasia

# CARA 2: Pakai ARG untuk build-time (lebih baik)
#ARG PORT=3000
#ENV PORT=$PORT

# CARA 3: Via file .env saat run (TERBAIK untuk production)
# Nanti kita passing saat docker run

# ============================================
# EXPOSE PORT
# ============================================
# Memberi tahu Docker bahwa aplikasi menggunakan port ini
# Ini hanya dokumentasi, tidak otomatis membuka port
EXPOSE 3000

# ============================================
# CREATE NON-ROOT USER (SECURITY)
# ============================================
# Jangan jalankan aplikasi sebagai root untuk keamanan
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Ganti ownership folder /app ke user nodejs
RUN chown -R nodejs:nodejs /app

# Pindah ke user nodejs
USER nodejs

# ============================================
# HEALTHCHECK (opsional, untuk monitoring)
# ============================================
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})" || exit 1

# ============================================
# COMMAND TO RUN APPLICATION
# ============================================
# Ini perintah yang akan jalan saat container start
CMD ["node", "index.js"]
# Kalau entry point kamu app.js, ganti jadi:
# CMD ["node", "app.js"]