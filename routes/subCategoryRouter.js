const express = require("express");
const {
    createSubCategory,
     getAllSubCategories, 
     getSingleSubCategores,
     updateSubCategory,
     deletSubCategory,
    
    } = require("../controllars/subCategortController")
    const {jwtToken} = require("../middlewares/verifyToken");
const allowedto = require("../middlewares/allowedTo");
// mergeParams => allow us to access other route
const router = express.Router({mergeParams: true})

router.post("/",jwtToken, allowedto("admin", "manager"), createSubCategory)
router.get("/", getAllSubCategories)
router.get("/:id", getSingleSubCategores)
router.patch("/:id", jwtToken, allowedto("admin", "manager"), updateSubCategory)
router.delete("/:id", jwtToken, allowedto("admin", "manager"), deletSubCategory)

module.exports = router; 