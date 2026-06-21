const express = require("express");
const router = express.Router()
const {addWishList, deleteWishList, getAllWishList} = require("../controllars/wishListController")
const allowedto = require("../middlewares/allowedTo")
const {jwtToken} =require("../middlewares/verifyToken")

router.post("/", jwtToken, allowedto("user"), addWishList)
router.delete("/:id", jwtToken, allowedto("user"), deleteWishList)
router.get("/", jwtToken, allowedto("user"), getAllWishList)

module.exports = router