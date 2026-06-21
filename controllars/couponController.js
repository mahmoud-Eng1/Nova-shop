const asyncHandler = require("express-async-handler");
const Coupon = require("../models/couponSchema");
const AppError = require("../utils/AppErrors");

// @desc create coupon
// @route /coupon
// @access private => admin or manager
exports.createCoupon = asyncHandler( async (req, res, next)=> {
    const {name, discount} = req.body
    if(!name || !discount ) return next(new AppError("all fields are required", 400));
    const existCoupon = await Coupon.findOne({name});
    if(existCoupon) return next(new AppError("coupone already exist", 400));
    const coupon = await Coupon.create({
        name,
        discount,
        expire: Date.now() + 7*24*60*60*1000, //expire after 7 days
    })
    res.status(201).json({message: "coupon created seccessfully", data:coupon })
});

// @desc get all coupon
// @route /coupon
// @access private => admin or manager
exports.getAllCoupon = asyncHandler( async (req, res, next)=> {
    const coupon = await Coupon.find();
    if(coupon.length === 0) return next(new AppError("not found any coupon", 404));
    res.status(200).json({result: coupon.length, data: coupon})
})

// @desc spceific coupone coupon
// @route /coupon/:id
// @access private => admin or manager
exports.getSingleCoupon = asyncHandler( async (req, res, next) => {
    const{id} = req.params;
    const coupon = await Coupon.findById(id);
    if(!coupon) return next(new AppError("coupone not found", 404));
    res.status(200).json({ adta: coupon})
})

// @desc update spceific coupon
// @route /coupon/:id
// @access private => admin or manager
exports.updateCoupon = asyncHandler( async (req, res, next) => {
    const {id} = req.params;
    const coupon = await Coupon.findByIdAndUpdate( id, req.body, {new: true});
    if(!coupon) return next(new AppError("coupon not found", 404));
    res.status(200).json({status: "success to update this coupon", data: coupon})
})

// @desc delete spceific coupon
// @route /coupon/:id
// @access private => admin or manager
exports.deleteCoupon = asyncHandler( async (req, res, next) => {
    const {id} = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if(!coupon) return next(new AppError("coupon not found", 404));
    res.status(204).send();
})