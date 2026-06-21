
const asyncHandler = require("express-async-handler");
const Users = require("../models/authentcationSchema");

// @desc create address
// @route post /addresses
// @access private => user
exports.createAddresses =asyncHandler( async (req, res, next)=> {
    
    const user = await Users.findByIdAndUpdate({_id: req.user._id},{
$addToSet: {addresses: req.body}
    },{new: true})

    res.status(201).json({status: "seccessfull",
    message: "seccessfull to add address", 
    data:user.addresses})
});

// @desc get address
// @route get /addresses/:id
// @access private => user
exports.deleteAddress = asyncHandler( async (req, res, next)=> {
    const user = await Users.findByIdAndUpdate({_id: req.user._id},{
$pull: {addresses: {_id:req.params.id}}
    },{new: true})
    res.status(200).json({status: "seccessfull",
    message: "seccessfull to delete this product to your wish list", 
    data:user.addresses})
})
// @desc get all  addresses
// @route get /addresses
// @access private => user
exports.getAllAddresses = asyncHandler( async (req, res, next)=>{
    const user = await Users.findById(req.user._id).populate("addresses");
    
    res.status(200).json({result: user.addresses.length , data: user.addresses})
})