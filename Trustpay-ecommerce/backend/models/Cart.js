const mongoose = import('mongoose');

const cartSchema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' 
    },
    cartItems: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true, 
            ref: 'Product' 
        },
        quantity: { 
            type: Number, 
            required: true, 
            default: 1 
        }
    }]
}, { timestamps: true });

export default = mongoose.model('Cart', cartSchema);