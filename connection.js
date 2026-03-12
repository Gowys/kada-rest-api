const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(["1.1.1.1", "1.0.0.1"]);

// CORRECT FORMAT: include database name at the end
const mongoURI = 'mongodb+srv://hugoestowork_db_user:kadabatch3@firstmongo.l9deuks.mongodb.net/firstmongo';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('✅ Koneksi ke MongoDB Atlas berhasil!');
    } catch (error) {
        console.error('❌ Koneksi gagal:', error.message);
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB;