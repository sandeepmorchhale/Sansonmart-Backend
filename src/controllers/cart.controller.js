const Cart = require("../models/cart.model");

const addToCart = async (req, res) => {
    try {
        const { product, name, price, image, quantity } = req.body;
        const userId = req.user._id;

        let cart = await Cart.findOne({ user: userId });

        if (cart) {
            // Agar cart pehle se hai, check karo product hai ya nahi
            const itemIndex = cart.cartItems.findIndex(p => p.product == product);

            if (itemIndex > -1) {
                // Product hai toh quantity badha do
                cart.cartItems[itemIndex].quantity += quantity;
            } else {
                // Naya product add karo
                cart.cartItems.push({ product, name, price, image, quantity });
            }
            cart = await cart.save();
        } else {
            // Naya cart banao
            cart = await Cart.create({
                user: userId,
                cartItems: [{ product, name, price, image, quantity }]
            });
        }
        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        res.status(200).json({ success: true, cart: cart ? cart.cartItems : [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



const removeCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.id; // URL se product ID lenge

        const cart = await Cart.findOne({ user: userId });

        if (cart) {
            // Filter karke us product ko nikal denge
            cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== productId);
            await cart.save();
            return res.status(200).json({ success: true, message: "Item removed", cart: cart.cartItems });
        }
        
        res.status(404).json({ success: false, message: "Cart not found" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports={
    getCart,
    addToCart,
    removeCartItem
}