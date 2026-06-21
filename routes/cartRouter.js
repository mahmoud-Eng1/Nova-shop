const express = require("express");
const {addToCart, getCart, deleteCartTtem, deleteProductsOFCart, applyCoupon} = require("../controllars/cartController");
const allowedto = require("../middlewares/allowedTo")
const {jwtToken} =require("../middlewares/verifyToken")
const router = express.Router();

router.post("/", jwtToken, allowedto("user"), addToCart);
router.put("/", jwtToken, allowedto("user"), applyCoupon);
router.get("/", jwtToken, allowedto("user"), getCart);
router.delete("/:id", jwtToken, allowedto("user"), deleteCartTtem);
router.delete("/", jwtToken, allowedto("user"), deleteProductsOFCart);
module.exports = router; 