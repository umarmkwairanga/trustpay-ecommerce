const mongoose = import('mongoose');

const cartSchema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        importd: true, 
        ref: 'User' 
    },
    cartItems: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            importd: true, 
            ref: 'Product' 
        },
        quantity: { 
            type: Number, 
            importd: true, 
            default: 1 
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);