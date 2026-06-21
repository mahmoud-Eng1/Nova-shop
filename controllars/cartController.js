const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartSchema");
const AppError = require("../utils/AppErrors");
const Product = require("../models/productSchema.js");
const Coupon = require("../models/couponSchema");

const countTotalPrice = (cart)=> {
    let totalPrice = 0;
    cart.cartItems.forEach((item)=> {
        totalPrice =+ item.price * item.quantity
    })
    cart.cartTotalPrice = totalPrice;
    return totalPrice;
}

// @desc add product to cart
// @route post /cart
// @access private => user
exports.addToCart = asyncHandler( async (req, res, next)=> {
    const {productId, color} = req.body;
    if(!productId) return next(new AppError("product id is required", 400));
    const product = await Product.findById(productId);
    let cart = await Cart.findOne({user: req.user});
    if(!cart){
        cart = await Cart.create({
            user: req.user,
            cartItems: [{product: productId, color, price: product.price}],
        })
    } else{

         // if product exist in cart update quantity and price
        const productExist = cart.cartItems.findIndex((item)=> item.product.toString() === productId && item.color === color);
        if(productExist > -1 ) {
            const cartItem = cart.cartItems[productExist]
             cartItem.quantity +=1;
        } else {
            // if product not exist in cart add it to cart
            cart.cartItems.push({product: productId, color, price: product.price});
            cart.cartTotalPrice += product.price;
        }
    }

    // count cart Total Price
    countTotalPrice(cart);
    
    await cart.save();

    res.status(200).json({
        status: "success",
        message: "product added to cart successfully",
        data: cart,
    })
})

// @desc get user cart
// @route get /cart
// @access private => user
exports.getCart = asyncHandler( async (req, res, next)=> {
    const cart = await Cart.findOne({user: req.user._id})
    if(cart.length === 0) return next(new AppError("cart is empty", 400));
    res.status(200).json({
        status: "success",
        result: cart.length,
        data: cart,
    });
}) ;

// @desc delete product of cart
// @route delete /cart/:id
// @access private => user
exports.deleteCartTtem = asyncHandler( async (req, res, next)=> {
    const {id} =req.params;
    const cart = await Cart.findOne({user: req.user._id});
    if(cart.length === 0) return next(new AppError("cart is empty", 400));
    // hold index of item in cart
    const indexItem = cart.cartItems.findIndex((item)=> item._id.toString() === id);
    // check if item exist in cart
    if(indexItem > -1){
        //check if quantity of item in cart more than 1 if true decrease quantity by 1 else remove item from crt
        if(cart.cartItems[indexItem].quantity > 1){
            cart.cartItems[indexItem].quantity -= 1;
        } else {
            cart.cartItems.splice(indexItem,1);
        }
        countTotalPrice(cart);
        
        await cart.save();
        
    }
    res.status(200).json({
        data: cart,
    })
})

// @desc delete all product of cart
// @route delete /cart
// @access private => user
exports.deleteProductsOFCart = asyncHandler( async (req, res, next)=> {
    const cart = await Cart.findOneAndDelete({user: req.user._id});
    if(!cart) return next(new AppError("cart is empty", 400));
    res.status(204).send();
});

// @desc count total price after discount in cart
// @route put /cart
// @access private => user
exports.applyCoupon = asyncHandler( async (req, res, next)=> {
    const {coupon} = req.body;
    const coupone = await Coupon.findOne({name: coupon, expire: {$gt: Date.now()}});
    if(!coupone) return next(new AppError("invalid or expired coupone", 400));
    const cart = await Cart.findOne({user: req.user._id});
    if (!cart) return next(new AppError("Cart not found", 404));
    
    //calculate discount price
    const totalPrice = cart.cartTotalPrice;
    const totalPriceAfterDiscount  = (totalPrice - (totalPrice * coupone.discount) /100).toFixed(2);
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    await cart.save();
    res.status(200).json({
        status: "success",
        data: cart,
    })

})
