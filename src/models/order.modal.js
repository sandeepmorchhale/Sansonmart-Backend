const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
        }
    ],
    shippingAddress: {  // Isko array [] se object {} kar diya hai, usually address ek hi hota hai
        username: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        mobile: { type: String, required: true },
    },
    totalPrice: { type: Number, required: true },
    
    // --- NEW PAYMENT FIELDS (ADD THESE) ---
    paymentMethod: { 
        type: String, 
        required: true, 
        default: "COD" // "COD" or "Online"
    },
    paymentStatus: {
        type: String,
        default: "Pending" // "Pending" or "Paid"
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    paymentResult: { // Razorpay IDs save karne ke liye
        id: String,
        status: String,
        update_time: String,
        email_address: String,
    },
    // --------------------------------------

    status: {
        type: String,
        required: true,
        default: 'Processing',
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled']
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);