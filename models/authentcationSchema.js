const mongoose = require("mongoose")

const usersSchema = new mongoose.Schema({
first_name: {
    type: String,
    require: true
},
last_name: {
    type: String,
    require: true,
},
email: {
    type: String,
    require: true,
    unique: true,
    lowecase: true
},
password: {
    type: String,
    require: true,
    select: false,
    minlength: [8, "password is short must be above or equal 8 "],
},
phone: String,
passwordChangedAt: Date,
 resetPassword: String,
 resetPasswordExpires: Date,
 resetPasswordVerify: Boolean,
image: String,
role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
},
wishlist: [{
    type: mongoose.Schema.ObjectId, 
    ref: "Product",
}],
addresses:[{
    id: {type:mongoose.Schema.ObjectId},
    alias: String,
    details: String,
    phone: String,
    city: String,
    postalCode: String,
}]

}, {timestamps: true});

const Users = mongoose.model("Users", usersSchema)
module.exports = Users