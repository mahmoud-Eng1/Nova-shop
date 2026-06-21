const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandSchema");
const AppErrors = require("../utils/AppErrors");
const ApiFeature = require("../utils/apiFeature")


// @desc create brand
// @route /brand
// @access private => admin or manager

const createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  if (!name) return next(new AppErrors("name is required", 400));
  const existBrand = await Brand.findOne({ name });
  if (existBrand) return next(new AppErrors("brand already exist", 400));
  // slugify makes a URL-friendly version of the name
  const brand = await Brand.create({ name, slug: slugify(name) });

  res.status(201).json({ data: brand });
});
  

// @desc get all brands
// @route /brand
// @access public
const getAllBrands  = asyncHandler(async (req, res, next) => {
  const numberOfCount = await Brand.countDocuments()
  const apiFeature = new ApiFeature(Brand.find({}), req.query).fields().filter().search().sort().paginate(numberOfCount)
 
  const {mongooseQuery, ResultPagination} = apiFeature
  const brands = await mongooseQuery
  if (Brand.length === 0)
    return next(new AppErrors("not found category", 404));
  res.status(200).json({ result:brands.length, ResultPagination , data: brands });
});

// @desc get single brand
// @route /brand/:id
// @access public

const getSingleBrand  = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const getBrand = await Brand.findById(id);
  if(!getBrand) return next(new AppErrors("category not found", 404));
  res.status(200).json({data: getBrand})
});

// @desc update single brand
// @route /brand/:id
// @access private => admin or manager
const updateBrand  = asyncHandler(
  async (req, res, next)=> {
    const {id} = req.params;
    const {name} = req.body;
if(!name)return next(new AppErrors("name is require", 400))
    const  uPdateBrand = await Brand.findByIdAndUpdate({_id:id}, {name , slug: slugify(name)}, {new:true})
  if(!uPdateBrand) return next(new AppErrors("brand not found", 404))
    res.status(200).json({data: uPdateBrand })
  }
)

// @desc delete single brand
// @route /brand/:id
// @access private => admin or manager

const deletBrand  = asyncHandler(
  async (req, res, next)=> {
    const {id} = req.params
    const deletedBrand = await Brand.findByIdAndDelete(id)
    if(!deletedBrand) return next( new AppErrors("brand not found", 404))
      res.status(200).json({message: "deleted successfuly"})

  }
)

module.exports = {
  createBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
  deletBrand,
};
