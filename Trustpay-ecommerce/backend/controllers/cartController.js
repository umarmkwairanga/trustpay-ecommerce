const Cart = require('../models/Cart');

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    try {
        let cart = await Cart.findOne({ user: userId });
        if (cart) {
            const itemIndex = cart.cartItems.findIndex(item => item.product == productId);
            if (itemIndex > -1) {
                cart.cartItems[itemIndex].quantity += quantity;
            } else {
                cart.cartItems.push({ product: productId, quantity });
            }
            await cart.save();
        } else {
            cart = await Cart.create({ user: userId, cartItems: [{ product: productId, quantity }] });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
        res.json(cart || { cartItems: [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== req.params.productId);
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addToCart, getCart, removeFromCart };