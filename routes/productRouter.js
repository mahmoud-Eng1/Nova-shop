const express = require("express");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  uPdateProduct,
  deletProduct,
} = require("../controllars/productController");
const { productValidation } = require("../validationJoi/joiSchemaValidtor");
const {
  checkSubCategoriesBelongToCategory,
} = require("../middlewares/productsMiddleware");
const { validateSubCategoryIds } = require("../middlewares/productsMiddleware");
const validate = require("../validationJoi/validate");
const multer = require("multer");
const reviewsRouter = require("./reviewRouter");
const { jwtToken } = require("../middlewares/verifyToken");
const allowedto = require("../middlewares/allowedTo");

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });
router.use("/:productId/reviews", reviewsRouter);

router.get(
  "/",
  jwtToken,
  allowedto("user", "admin", "manager"),
  getAllProducts
);
router.post(
  "/",
  jwtToken,
  allowedto("admin", "manager"),
  upload.fields([{ name: "image" }, { name: "imageCover" }]),
  validate(productValidation),
  checkSubCategoriesBelongToCategory,
  validateSubCategoryIds,
  createProduct
);
router.get(
  "/:id",
  jwtToken,
  allowedto("user", "admin", "manager"),
  getSingleProduct
);
router.patch(
  "/:id",
  jwtToken,
  allowedto("admin", "manager"),
  upload.fields([{ name: "image" }, { name: "imageCover" }]),
  uPdateProduct
);
router.delete("/:id", jwtToken, allowedto("admin", "manager"), deletProduct);

module.exports = router;
