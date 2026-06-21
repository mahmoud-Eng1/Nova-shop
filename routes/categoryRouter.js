const express = require("express");
const {verifyAdmin} = require("../middlewares/verifyAdmin")
const { createCategory,
    getAllCategories,
    getSingleCategores,
    updateCategory,
    deletCategory, } = require("../controllars/categoriesController");
    const {jwtToken} =require("../middlewares/verifyToken")
const subCategoryRouter = require("./subCategoryRouter")
const allowedto = require("../middlewares/allowedTo")
const router = express.Router();
router.use("/:categoryId/subcategory", subCategoryRouter)

router.post("/", jwtToken, allowedto("admin", "manager") ,createCategory);
router.get("/", jwtToken, allowedto("user","admin", "manager"), getAllCategories); 
router.get("/:id", jwtToken, allowedto("user","admin", "manager"), getSingleCategores); 
router.patch("/:id", jwtToken, allowedto("admin", "manager"), updateCategory); 
router.delete("/:id", jwtToken, allowedto("admin", "manager"), deletCategory); 

module.exports = router;
