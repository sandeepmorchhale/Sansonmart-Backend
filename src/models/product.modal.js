const mongoose = require('mongoose');

const productschema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    village: {
        type: String,

    },
    price: {
        type: Number,
        required: true
    },
    packaging: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    veriety: {
        type: String,
    },
    contact: {
        type: Number,
        require: true
    },
    img: {
        type: String,
        // require: true
    },

}, {
    timestamps: true
});

const product = mongoose.model("product", productschema)

module.exports = product;

