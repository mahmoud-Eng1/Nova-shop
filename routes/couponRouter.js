const express= require("express");
const router = express.Router();
const allowedto = require("../middlewares/allowedTo")
const {jwtToken} =require("../middlewares/verifyToken")
const {createCoupon, getAllCoupon, getSingleCoupon, updateCoupon, deleteCoupon} = require("../controllars/couponController") 

router.use(jwtToken, allowedto("admin", "manager"));
router.post("/", createCoupon)
router.get("/", getAllCoupon)
router.get("/:id", getSingleCoupon)
router.patch("/:id", updateCoupon)
router.delete("/:id", deleteCoupon)

module.exports = router