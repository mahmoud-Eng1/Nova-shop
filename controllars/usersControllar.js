const Users =  require("../models/authentcationSchema");
const AppErrors = require("../utils/AppErrors")
const bcrypt = require("bcrypt")
const asyncHandler = require("express-async-handler");

// @desc get all user
// @route /users
// @access private
exports.getAllUsers = asyncHandler( async (req, res, next)=> {
 const users = await Users.find().select("-__v");
 if(!users) return next(new AppErrors("users not found", 400))
    res.status(200).json({data:users})
})

// @desc get single user
// @route /users/:id
// @access public
exports.getSingleUser = asyncHandler( async (req, res, next)=> {
    const {id} = req.params
 const user = await Users.findById(id).select("-__v");
 if(!user) return next(new AppErrors("user not found", 400))
    res.status(200).json({data:user})
})

// @desc update user
// @route /users/:id
// @access private
exports.updateUser = asyncHandler( async (req, res, next)=> {
    const {id} = req.params

    if(req.file){
        req.body.image = req.file.filename
    }

    if(req.body.password || req.body.confirm_password){
        return next(new AppErrors("Password update not allowed here",400))
     }
   
 if(!req.body && !req.file ) return next(new AppErrors("Please provide at least one field to update",400)) 
    const ubdateUser = await Users.findOneAndUpdate({_id:id},
 {first_name:req.body.first_name,
  last_name: req.body.last_name,
  image:req.body.image,
  email: req.body.email
 },
  {new:true});
if(!ubdateUser) return next(new AppErrors("user not found", 404))
    res.status(201).json({data:ubdateUser})
})

// @desc delete user
// @route /users/:id
// @access private
exports.deleteUser = asyncHandler( async (req, res, next)=> {
    const {id} = req.params

    const deleted = await Users.findByIdAndDelete(id)
if(!deleted) return next(new AppErrors("user not found", 400))

    res.status(204).json({message: "deleted successfuly"})
})

// @desc update password
// @route /:id/password
// @access public
exports.updatePassword = asyncHandler( async (req, res, next)=> {
const {id}= req.params
const {current_password, new_password , confirm_password} = req.body
const user = await Users.findById(id).select("+password");
if(!user) return next(new AppErrors("user not found", 400));
const isMatch = await bcrypt.compare(current_password, user.password);
if(!isMatch) return next(new AppErrors("Incorrect current password", 400));
if(new_password !== confirm_password) return next(new AppErrors("Incorrect password", 400));
const hashPassword = await bcrypt.hash(new_password, 12)
    const updatePass = await Users.findOneAndUpdate({_id: id}, {password: hashPassword, passwordChangedAt:Date.now()}, {new: true})
    res.status(201).json({data: updatePass})
})

exports.addAdmin = asyncHandler( async (req, res, next)=> {
    const {id} = req.params;
    const user = await Users.findById(id) ;
    if(!user) return next(new AppErrors("user not found", 404));
    const updateUser = await Users.findByIdAndUpdate({_id:id}, {role: "admin"}, {new:true});
    res.status(201).json({message: "this user become admin", updateUser});
} )