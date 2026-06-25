const express = require("express");
const {createReview, getAllReviews, getProductReviews, updateReview, deleteReview} = require("../controllars/reviewsController");
const {jwtToken} = require("../middlewares/verifyToken");
const allowedto = require("../middlewares/allowedTo");
const {validateReviewJoi} = require("../middlewares/joiMiddleware.js")

const router = express.Router({mergeParams: true});

router.post("/", jwtToken, allowedto("user"), validateReviewJoi, createReview);
router.get("/",getAllReviews);
router.get("/:id",getProductReviews);
router.patch("/:id", allowedto("user"), jwtToken,updateReview);
router.delete("/:id", allowedto("user", "admin"), jwtToken,deleteReview);


module.exports = router;