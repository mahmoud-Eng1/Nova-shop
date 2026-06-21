/* eslint-disable node/no-extraneous-require */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require("mongoose");

const categotySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category is required"],
      unique: [true, "category most be unique"],
      minlength: [3, "too short category name"],
      maxlength: [32, "too long category name"],
    },

    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categotySchema);

module.exports = Category;
