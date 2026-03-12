const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductSchema = new Schema({
    id: ObjectId,
    name: String,
    description: String,
    price: Number,
    stock: Number,
    Image_url: String,
}, {timestamps : true 
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;