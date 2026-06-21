const express = require("express")
const {createOrder, getAllOrders, getSpecificOrder, updateOrderToPaid, updateOrderToDelivered, addTaxAndShippingPrice, checkOutSession}= require("../controllars/orderController")
const allowedto = require("../middlewares/allowedTo")
const {jwtToken} =require("../middlewares/verifyToken")

const router = express.Router()


router.post("/:id", jwtToken, allowedto("user"), createOrder);
router.get("/", jwtToken ,allowedto("user", "admin", "manager"),getAllOrders);
router.get("/:id", jwtToken ,allowedto("user", "admin", "manager"),getSpecificOrder);
router.put("/:id/pay", jwtToken ,allowedto( "admin", "manager"),updateOrderToPaid);
router.put("/:id/delivered", jwtToken ,allowedto( "admin", "manager"),updateOrderToDelivered);
router.patch("/:id/shipping-tax", jwtToken ,allowedto( "admin", "manager"),addTaxAndShippingPrice);
router.post("/:id/create-session", jwtToken ,allowedto( "user"),checkOutSession);
module.exports = router;