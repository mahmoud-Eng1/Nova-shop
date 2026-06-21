const asyncHandler = require("express-async-handler");
const Users = require("../models/authentcationSchema");


// @desc create wish list
// @route /wishlist
// @access private => user
exports.addWishList =asyncHandler( async (req, res, next)=> {
    
    const user = await Users.findByIdAndUpdate({_id: req.user},{
$addToSet: {wishlist: req.body.productId}
    },{new: true})
    

    res.status(201).json({status: "succefull",
    message: "seccessfull to add this product to your wish list", 
    data:user.wishlist})
});

// @desc delete wish list
// @route /wishlist/:id
// @access private => user
exports.deleteWishList = asyncHandler( async (req, res, next)=> {
    const user = await Users.findByIdAndUpdate({_id: req.user._id},{
$pull: {wishlist: req.params.id}
    },{new: true})
    res.status(200).json({status: "succefull",
    message: "seccessfull to delete this product to your wish list", 
    data:user.wishlist})
});

// @desc get all wish list
// @route /wishlist
// @access private => user
exports.getAllWishList = asyncHandler( async (req, res, next)=>{
    const user = await Users.findById(req.user._id).populate("wishlist");
    
    res.status(200).json({data: user.wishlist})
})