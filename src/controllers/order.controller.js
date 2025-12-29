
const Order = require("../models/order.modal")
const Cart = require("../models/cart.model")

const getMyOrders = async (req, res) => {
    try {
        // req.user._id hume tab milega jab user login hoga (middleware se)
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error: Could not fetch orders",
            error: error.message
        });
    }
};
const newOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, totalPrice } = req.body;

        const order = await Order.create({
            orderItems,
            shippingAddress,
            totalPrice,
            user: req.user._id, // Login user ki ID
            orderStatus: "Processing" // Default status set karein
        });

        // Agar cart se order hai toh cart khali karein
        if (!req.body.isDirectPurchase) {
            await Cart.findOneAndDelete({ user: req.user._id });
        }
        res.status(201).json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const adminorder = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "error facing orders",
        });

    }
}
const adminstatusupdate = async (req, res) => {
    try {
        const { status } = req.body;
        // Aapke log ke hisab se field name 'status' hai
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );
        res.json({ success: true, message: "Updated", order });

    } catch (err) {
        res.status(500).json({ success: false, message: "Error" });
    }
}


const deleteorder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id)

        if (!order) {
            return res.status(404).json({
                status: false,
                message: "Invaild Order and order not found"
            })
        }
        res.json({
            status:true,
            message:"item delete sucessfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal Error"
        })
    }
}



module.exports = {
    getMyOrders,
    newOrder,
    adminorder,
    adminstatusupdate,
    deleteorder
}