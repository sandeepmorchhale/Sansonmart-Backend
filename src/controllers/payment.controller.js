const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/order.modal"); // <--- 1. Order Model Import karein
require("dotenv").config();

// Razorpay Instance Initialize
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Order Controller
const onlinepayment = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        if (!amount) {
            return res.status(400).json({ error: "Amount is required" });
        }

        const options = {
            amount: amount * 100, // Amount paise mein
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order: order,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Order creation failed" });
    }
};

// 2. Verify Payment Controller (UPDATED)
const verifyPayment = async (req, res) => {
    try {
        // Frontend se aane wala sara data yahan receive karein
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            orderItems,       // <--- Frontend se aa raha hai
            shippingAddress,  // <--- Frontend se aa raha hai
            totalPrice,       // <--- Frontend se aa raha hai
            userId            // <--- Agar frontend se bhej rahe ho (Optional)
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            
            // --- DATABASE SAVE LOGIC START ---
            
            // Dhyan dein: `req.user._id` tabhi milega agar apne Route me Auth Middleware lagaya hai.
            // Agar Middleware nahi hai, to Frontend se `userId` bhejna padega.
            const user = req.user ? req.user._id : userId; 

            const newOrder = await Order.create({
                user: user, 
                orderItems,
                shippingAddress,
                totalPrice,
                paymentMethod: "Online",
                
                // IMPORTANT: Status Update
                paymentStatus: "Paid",   // <--- Ab ye database me "Paid" save hoga
                isPaid: true,
                paidAt: Date.now(),
                
                paymentResult: {
                    id: razorpay_payment_id,
                    status: "success",
                    update_time: String(Date.now()),
                    email_address: shippingAddress.email,
                },
                status: "Processing"
            });

            // --- DATABASE SAVE LOGIC END ---

            res.status(200).json({
                success: true,
                message: "Payment verified and Order Placed successfully",
                orderId: newOrder._id
            });

        } else {
            res.status(400).json({
                success: false,
                message: "Invalid Signature",
            });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    onlinepayment,
    verifyPayment,
};