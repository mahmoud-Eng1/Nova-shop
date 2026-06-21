/* eslint-disable node/no-extraneous-require */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
    trim: true,
    unique: [true, "SubCategory must be unique" ],
    minlength: [2, "to short SubCategory name"],
    maxlength: [32, "to long SubCategory name"],
},
slug: {
    type: String,
    lowercase: true,
},
category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "  SubCategory must be to parent category"]
},


},{timestamps: true})

const SubCategory = mongoose.model("SubCategory", subCategorySchema )

module.exports = SubCategory;