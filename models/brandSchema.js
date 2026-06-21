/* eslint-disable node/no-extraneous-require */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand is required"],
      unique: [true, "brand most be unique"],
      minlength: [3, "too short brand name"],
      maxlength: [32, "too long brand name"],
    },

    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
