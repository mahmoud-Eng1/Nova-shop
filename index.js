/* eslint-disable node/no-extraneous-require */
/* eslint-disable import/extensions */
/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */

require("dotenv").config();
const express = require("express");
require("morgan");
require("./config/db");


const corsOptions = require("./config/optionsCorse");
const path = require("path");
const rootPage = require("./routes/root.js");
const categotyRouter = require("./routes/categoryRouter.js");
const brandRouter = require("./routes/BrandsRouter.js");
const subCategotyRouter = require("./routes/subCategoryRouter.js");
const productRouter = require("./routes/productRouter.js");
const authentcation = require("./routes/authentcationRoute.js");
const users = require("./routes/usersRoute.js");
const reviewsRouter = require("./routes/reviewRouter.js");
const wishListRouter = require("./routes/wishlistRouter.js");
const addressesRouter = require("./routes/addressesRouter.js");
const couponRouter = require("./routes/couponRouter.js");
const cartRouter = require("./routes/cartRouter.js");
const orderRouter = require("./routes/orderRouter.js");
const mongoose = require('mongoose'); 
// const compression = require('compression')
const {validateProduct, 
  validationBrand, 
  validationSubcategory,
  validateUserJoi,
  validateCouponJoi,
  validateReviewJoi,
} = require("./middlewares/joiMiddleware.js")

const cors = require("cors");
const morgan = require("morgan");
const app = express();
const port = 5500;

//  middlewere

app.use("/files", express.static(path.join(__dirname, "uploads")));
app.use(cors(corsOptions));
// Compress all HTTP responses to reduce payload size and improve performance
// app.use(compression)
app.use(express.json());
app.set('query parser', 'extended');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//  routes

app.use("/api/v1/", rootPage);
app.use("/api/v1/category", validationBrand,categotyRouter);
app.use("/api/v1/brand", validationBrand,brandRouter);
app.use("/api/v1/subcategory", validationSubcategory,subCategotyRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/reviews", validateReviewJoi, reviewsRouter);
app.use("/api/v1/wishlist", wishListRouter);
app.use("/api/v1/addresses", addressesRouter);
app.use("/api/v1/coupon", validateCouponJoi, couponRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/users", validateUserJoi, authentcation, users);

app.all(/.*/, (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "public", "notFound.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "page Not found" });
  } else {
    res.type("text").send("page Not found");
  }
});




app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode,
    message: (err && err.message) || "Something went wrong",
    
  });
});


mongoose.connection.once("open", ()=> {
  console.log("db worked");
  app.listen(port, () => {
    console.log(`server work at port ${port}`);
  })
})
    
mongoose.connection.on("error",(err)=> {
  console.log(err)
})

