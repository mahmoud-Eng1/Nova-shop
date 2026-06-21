const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
title: String,
rating: {
    type: Number,
    min: [1, "rating must be above or equal 1.0"],
max: [5, "rating must be below or equal 5.0"],
    required: true
},
user: {
    type: mongoose.Schema.ObjectId,
    ref: "Users"
},
product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
}

}, {timestamps: true})

const Reviews = mongoose.model("Reviews", reviewSchema);
module.exports = Reviews