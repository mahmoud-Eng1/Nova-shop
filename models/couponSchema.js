const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true, "coupon name is required"],
        unique: true,
        trim: true,
    },
    discount: {
        type:Number,
        required: [true, "coupone discount is required"]
    },
    expire: {
        type: Date,
        required: [true, "coupone expire date is required"]
    }
}, {timestamps: true});

const Coupon = mongoose.model("Coupone", couponSchema)
module.exports = Coupon