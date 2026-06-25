const express = require("express");
const { createBrand, getAllBrands, getSingleBrand, updateBrand, deletBrand } = require("../controllars/brandesController");
const allowedto = require("../middlewares/allowedTo")
const {jwtToken} =require("../middlewares/verifyToken")
const router = express.Router();
const {validationBrand} = require("../middlewares/joiMiddleware.js")


router.get("/", jwtToken, allowedto("user","admin", "manager"),  getAllBrands);
router.post("/", jwtToken, allowedto("admin", "manager"), validationBrand, createBrand); 
router.get("/:id", jwtToken, allowedto("user","admin", "manager"), getSingleBrand); 
router.patch("/:id", jwtToken, allowedto("admin", "manager"), updateBrand); 
router.delete("/:id", jwtToken, allowedto("admin", "manager"), deletBrand); 

module.exports = router;
