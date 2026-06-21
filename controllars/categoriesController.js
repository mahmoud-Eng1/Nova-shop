const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Category = require("../models/categorySchema");
const AppErrors = require("../utils/AppErrors");
const ApiFeature = require("../utils/apiFeature");


// @desc create category
// @route /category
// @access private

const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  if (!name) return next(new AppErrors("name is required", 400));
  const existCategory = await Category.findOne({ name });
  if (existCategory) return next(new AppErrors("category already exist", 400));
  // slugify makes a URL-friendly version of the name
  const category = await Category.create({ name, slug: slugify(name) });

  res.status(201).json({ data: category });
});
  

// @desc get all categories
// @route /category
// @access public
const getAllCategories = asyncHandler(async (req, res, next) => {
  
  const numberOfCount = await Category.countDocuments()
  const apiFeature = new ApiFeature(Category.find({}), req.query).fields().filter().search().sort().paginate(numberOfCount)
  const {mongooseQuery, ResultPagination} = apiFeature
  const categories = await mongooseQuery
  if (categories.length === 0)
    return next(new AppErrors("not found category", 404));
  res.status(200).json({ result:categories.length, ResultPagination , data: categories });
});

// @desc get single category
// @route /category/:id
// @access public

const getSingleCategores = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const getCategory = await Category.findById(id);
  if(!getCategory) return next(new AppErrors("category not found", 404));
  res.status(200).json({data: getCategory})
});

// @desc update single category
// @route /category/:id
// @access private => admin or manager
const updateCategory = asyncHandler(
  async (req, res, next)=> {
    const {id} = req.params;
    const {name} = req.body;
if(!name)return next(new AppErrors("name is require", 400))
    const  uPdate = await Category.findByIdAndUpdate({_id:id}, {name , slug: slugify(name)}, {new:true})
  if(!uPdate) return next(new AppErrors("category not found", 404))
    res.status(200).json({data:uPdate })
  }
)

// @desc delete single category
// @route /category/:id
// @access private =>admin or manager

const deletCategory = asyncHandler(
  async (req, res, next)=> {
    const {id} = req.params
    const deletedCategory = await Category.findByIdAndDelete(id)
    if(!deletedCategory) return next( new AppErrors("category not found", 404))
      res.status(200).json({message: "deleted successfuly"})

  }
)

module.exports = {
  createCategory,
  getAllCategories,
  getSingleCategores,
  updateCategory,
  deletCategory,
};
