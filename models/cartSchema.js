const mongoose =  require("mongoose");

const cartSchema = new  mongoose.Schema({
    cartItems :[{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
        },
        quantity: {
            type:Number,
            default: 1,
        },
        color: String,
        price: Number,
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "Users",
    },
    cartTotalPrice: {
        type: Number,
    },
    totalPriceAfterDiscount: {
        type:Number,
    },
   
}, {timestamps: true})

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;