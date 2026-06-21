const asyncHandler = require("express-async-handler");
const Order = require("../models/orderSchema");
const AppError = require("../utils/AppErrors")
const product = require("../models/productSchema");
const Cart = require("../models/cartSchema");
const Users = require("../models/authentcationSchema");
const stripe = require("stripe")(process.env.SECRET_KEY);


// @desc create user order
// @route post /orders/:id
// @access private => user
exports.createOrder = asyncHandler( async (req, res, next)=> {
    // get cart depended on cart id
    const {id} = req.params;
    
const cart = await Cart.findById(id);
if(!cart)return next(new AppError("there is no cart with this id", 404));
const order = await Order.findOne({user: req.user})
// check if there is a discount or not
let totalPriceOrders = 0;
if(cart.totalPriceAfterDiscount > 0){
    totalPriceOrders = cart.totalPriceAfterDiscount;
} else {
    totalPriceOrders = cart.cartTotalPrice;
};
totalPriceOrders = totalPriceOrders + order.taxPrice + order.shippingPrice

// create order depend on cart
    await Order.create({
    user: req.user,
    cartItems: cart.cartItems,
    shippingAddress: req.body?.shippingAddress, 
    totalOrderPrice: totalPriceOrders,
    
})



// after create order decrement product quantity and increment solid quantity
if(order){
    const pulWriteOption = cart.cartItems.map((item)=> {
        return {
            updateOne: {
                filter: {_id: item.product},
                update: {
                    $inc: {
                        quantity: -item.quantity, sold: +item.quantity,
                    }
                }
            }
        }
    })
    await product.bulkWrite(pulWriteOption, {})

    //clear cart
    await Cart.findByIdAndDelete(id);
}

res.status(201).json({
    status: "success",
    data: order,
});
});

// @desc get all orders
// @route get /orders
// @access private => user-admin-manager
exports.getAllOrders = asyncHandler( async (req, res, next)=>{
    
    const user = await Users.findById(req.user._id);
    if(user.role === "admin"|| user.role === "manager"){
        const orders = await Order.find();
       
        if(orders.length === 0) return next(new AppError("there is no orders", 404));
        res.status(200).json({
            status: "success",
            result: orders.length,
            data: orders,
        })
    } else {
        
        const userOrders = await Order.find({user: req.user});
        if(userOrders.length === 0) return next(new AppError("there is no orders for this user", 404));
        res.status(200).json({
            status: "success",
            result: userOrders.length,
            data: userOrders,
        })
    }
})

// @desc specific order
// @route get /orders/:id
// @access private => user-admin-manager
exports.getSpecificOrder = asyncHandler( async (req, res, next)=> {
    const {id} = req.params;
    const user = await Users.findById(req.user);
    if(user.role === "admin"|| user.role === "manager"){
        const order = await Order.findById(id)
        if(!order) return next(new AppError("there is no order with this id", 404));
        res.status(200).json({
            status: "success",
            data: order,
        })
    } else{
        const order = await Order.findOne({_id: id, user: req.user._id})
        if(!order) return next(new AppError("there is no order with this id for this user", 404));
        res.status(200).json({
            status: "success",
            data: order,
        })
    }
})

// @desc updat paied order
// @route put /orders/:id/pay
// @access private => admin-manager
exports.updateOrderToPaid = asyncHandler( async (req, res, next)=> {
    const order = await Order.findById(req.params.id);
if(!order) return next(new AppError("there is no order with this id", 404));
 order.isPaid = true;
 order.paidAt = Date.now();
 await order.save();
 res.status(200).json({
    status: "success",
    data: order,
 });
});

// @desc updat delivered  order
// @route put /orders/:id/delivered
// @access private => admin-manager
exports.updateOrderToDelivered = asyncHandler( async (req, res, next)=> {
    const order = await Order.findById(req.params.id);
if(!order) return next(new AppError("there is no order with this id", 404));
 order.isDelivered = true;
 order.deliveredAt = Date.now();
 await order.save();
 res.status(200).json({
    status: "success",
    data: order,
 });
});


// @desc add tax and shipping
// @route post /orders/:id/shipping-tax
// @access private => admin-manager
exports.addTaxAndShippingPrice = asyncHandler( async (req, res, next)=> {
    const {taxPrice, shippingPrice} = req.body;
    const order = await Order.findById(req.params.id);
    if(!order) return next(new AppError("there is no order with this id", 404));
    order.taxPrice = taxPrice;
    order.shippingPrice = shippingPrice;
    order.totalOrderPrice = order.totalOrderPrice + taxPrice + shippingPrice
    await order.save();
    res.status(200).json({
        data: order,
    });
});

// @desc create checkout sessions
// @route post /orders/checkout-session/cartId
// @access private => admin-manager

exports.checkOutSession  = asyncHandler( async (req, res, next)=> {
console.log("create session")
    const order = await Order.findOne({_id: req.params.id, user: req.user}).populate("user", "first_name")
    if(!order) return next(new AppError("there is no order with this id", 404))
        let totalPriceOrders = 0
    totalPriceOrders = order.totalOrderPrice
   // create checkout session to send data for stripe
 const session = await stripe.checkout.sessions.create({
  
            line_items: [
                {
                    price_data: {
                        currency: "egp",
                        product_data: {
                            name: "order",
                        },
                        unit_amount: totalPriceOrders,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/payment-success`,
        cancel_url: `${req.protocol}://${req.get("host")}/orders`,

        metadata: order.shippingAddress,
 })

 res.status(200).json({status: "success", data:session})
})