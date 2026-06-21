const mongoose = require("mongoose");

const orderSchma = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "Users",
        required: true,
    },
    cartItems: [
        {
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
        },
    ],
    taxPrice: {
        type: Number,
        default: 0,
    },
    shippingPrice: {
        type: Number,
        default: 0,
    },
    shippingAddress: {
        details: String,
        phone: String,
        city: String,
        postalCode: String,
    },
    totalOrderPrice: {
        type: Number,
    },
    paymentMethodType: {
        type: String,
        enum: ["cash", "card"],
        default: "cash",
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        default: false,
    },
    deliveredAt: Date,
},{timestamps: true});
orderSchma.pre(/^find/, function(next) {
    this.populate(
        {path: "user", 
        select: "first_name email phone"
    }).populate({path: "cartItems.product", select: "title price image "})
    
}
)
const Order = mongoose.model("Order", orderSchma);
module.exports = Order