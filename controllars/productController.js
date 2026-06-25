const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productSchema");
const AppErrors = require("../utils/AppErrors");
const Category = require("../models/categorySchema")
const SubCategory = require("../models/subCategorySchema")
const ApiFeature = require("../utils/apiFeature")


// @desc create product
// @route /product
// @access private => admin or manager

const createProduct = asyncHandler(async (req, res, next) => {
    console.log(req.body)
  req.body.slug = slugify(req.body.title);
  if (!req.body) return next(new AppErrors("name is required", 400));

  const existCategory = await Category.findById(req.body.category)
  if(!existCategory) return next(new AppErrors("this category not found", 404))

//slugify makes a URL-friendly version of the name

  if (req.files.image) {
    req.body.images = req.files.image.map((file)=> file.filename);
  }
  if(req.files.imageCover){
    req.body.imageCover = req.files.imageCover[0].filename
  }

  const product = await Product.create(req.body);

  res.status(201).json({ data: product });
});

// @desc get all products
// @route /product
// @access public
const getAllProducts = asyncHandler(async (req, res, next) => {

const numberOfCount = await Product.countDocuments()
for(const key in req.query){
  console.log(key, req.query)
}
 const apiFeature = new ApiFeature(Product.find(), req.query).fields().filter().search().sort().paginate(numberOfCount)
 const {mongooseQuery,ResultPagination } = apiFeature
   const products = await mongooseQuery

   if (products.length === 0)
     return next(new AppErrors("not found category", 404));
   res.status(200).json({ result: products.length, ResultPagination, data: products });
});

// @desc get single product
// @route /product/:id
// @access public

const getSingleProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const getProduct = await Product.findById(id).populate("reviews");
  if (!getProduct) return next(new AppErrors("product not found", 404));
  res.status(200).json({ data: getProduct });
});

// @desc update single category
// @route /category/:id
// @access private => admin or manager
const uPdateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // check if title send on req or not to update slug
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  if (!req.body) return next(new AppErrors("Enter the value you want to update", 400));
  const uPdate = await Product.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!uPdate) return next(new AppErrors("category not found", 404));
  res.status(200).json({ data: uPdate });
});

// @desc delete single Product
// @route /product/:id
// @access private => admin or manager

const deletProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  if (!deletedProduct) return next(new AppErrors("category not found", 404));
  res.status(200).json({ message: "deleted successfuly" });
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  uPdateProduct,
  deletProduct,
};
