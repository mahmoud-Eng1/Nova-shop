
const Reviews = require("../models/reviewSchema.js")
const AppError = require("../utils/AppErrors.js")
const Products = require("../models/productSchema.js")
const Users = require("../models/authentcationSchema.js")
const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const Product = require("../models/productSchema.js");
// this function to aggregate ratingAverage and ratingsQuantity in product
const sumAvgRatengAndCnontity = async (productId)=> {
const result = await Reviews.aggregate([{$match: {product: new mongoose.Types.ObjectId(productId)}}, 
    {$group:{
        _id: "$product",
         ratingsAverage:{$avg: "$rating"},
          ratingsQuantity:{$sum:1}
    }
        }
    ]
)
return result
}

// @desc create review
// @route /reviews
// @access public

exports.createReview = asyncHandler( async (req, res, next)=> {
    if(!req.body.product){
        req.body.product = req.params.productId
    }
    const reviewsExist = await Reviews.findOne({ user: req.user, product: req.body.product});
    if(reviewsExist) return next(new AppError("You already reviewed this produc", 400));
    const review = await Reviews.create({
        title: req.body.title,
        rating: req.body.rating,
        user: req.user,
        product:req.body.product,
    });
    const resultReview = await sumAvgRatengAndCnontity(req.params.productId)
    console.log(resultReview)
    
     await Product.findByIdAndUpdate({_id:req.params.productId},{
     ratingsAverage: resultReview[0]?.ratingsAverage || 0,
     ratingsQuantity:  resultReview[0]?.ratingsQuantity || 0,
     },
    )

    res.status(201).json({review})
})

// @desc get all reviews
// @route /reviews
// @access public
exports.getAllReviews = asyncHandler( async (req, res, next)=> {
    console.log(req.params)
    // feltration reviews belong to productId
    let filterReviews = {}
    if(req.params.productId) filterReviews = {product: req.params.productId}
    const reviews = await Reviews.find(filterReviews).populate("user" ,"first_name");
    if(reviews.length == 0) return next(new AppError("not found any reviews", 404));
    res.status(200).json({reviews})
})

// @desc get specific review belong to product
// @route /reviews/:id
// @access public
exports.getProductReviews = asyncHandler( async (req, res, next)=> {

    const reviews = await Reviews.find({product: req.params.id}).populate("user" ,"first_name")
    if(reviews.length == 0) return next(new AppError("not found any reviews", 404));
        res.status(200).json({reviews})
})
// @desc update review
// @route /reviews
// @access private =>user
exports.updateReview = asyncHandler( async (req, res, next)=> {
    const {id} = req.params
    const review = await Reviews.findOne({_id:id, user:req.user._id});
    if(!review) return next(new AppError("You are not allowed to update this review", 403))
    const ubdateReview = await Reviews.findByIdAndUpdate({_id:id},req.body,{new: true}).populate("user" ,"first_name");
    if(!ubdateReview) return next( new AppError("this rating not found", 404));
    
    const resultReview = await sumAvgRatengAndCnontity(ubdateReview.product)
     await Product.findByIdAndUpdate({_id:ubdateReview.product},{
     ratingsAverage: resultReview[0]?.ratingsAverage || 0,
     ratingsQuantity:  resultReview[0]?.ratingsQuantity || 0,
     },
    )
    res.status(200).json({ubdateReview})
})
 // @desc delete review
// @route /reviews
// @access private =>user or admin
exports.deleteReview = asyncHandler( async (req, res, next) => {
    const {id} = req.params;
    const review = await Reviews.findOne({_id:id});
    if (!review) {
        return next(new AppError("review not found", 404));
    }
    const user = await Users.findById(req.user._id)
    const isAdmin = user.role === "admin";
    const isManager = user.role === "manager";
    const isOner = review.user.toString() === req.user._id
    if(!isOner && !isAdmin && !isManager) return next(new AppError("You are not allowed to delete this review", 403));
    const deleteRev = await Reviews.findByIdAndDelete(id)
    if(!deleteRev) return next(new AppError("review not found", 404));
    
    // count average rating and count rating after delete the review
        const resultReview = await sumAvgRatengAndCnontity(deleteRev.product)
     await Product.findByIdAndUpdate({_id:deleteRev.product},{
     ratingsAverage: resultReview[0]?.ratingsAverage || 0,
     ratingsQuantity:  resultReview[0]?.ratingsQuantity || 0,
     },
    )
        
    res.status(204).send()
})


