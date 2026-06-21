const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
title: {
    type: String,
    required: true,
    minlength: [3, "too short product title"],
    maxlength: [200, "too long product title"],
    trim: true,
},
slug: {
type: String,
required: true,
lowercase: true,

},
description: {
    type: String,
    required: true,
    minlength: [10, "too short product description"],
},

quantity: {
    type: Number,
    required: [true, "product quantity is required"],
},

sold: {
    type: Number,
    default: 0,
},

price: {
    type: Number,
    required: [true, "price product is required"],
},

priceAfterDiscount: {
    type: Number,
},

colors: [String],
imageCover: {
    type:String,
   // required: [true, "image product cover is required"]
},

images: [String],
category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
   // required: [true, "product must be belong to category"],
},

subCategory: {
    type: [mongoose.Schema.ObjectId],
    ref: "SubCategory",
},
brand: {
    type: mongoose.Schema.ObjectId,
    ref: "Brand",
},
ratingsAverage: {
    type: Number,
    min: 0,
    max: [5, "rating must be below or equal 5.0"],
    default: 0,
},

ratingsQuantity: {
    type:Number,
    default: 0,
} 

}, {timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

})
// virtual populate
productSchema.virtual("reviews", {
    ref: "Reviews",
    localField: "_id",
    foreignField: "product",
})


const Product = mongoose.model("Product", productSchema)

module.exports = Product;