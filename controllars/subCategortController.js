const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const SubCategory = require("../models/subCategorySchema");
const AppErrors = require("../utils/AppErrors");

// @desc gcreate categories
// @route /subcategory
// @access private

const createSubCategory = asyncHandler(async (req, res, next) => {

  if(!req.body.category) req.body.category = req.params.categoryId 
    const { name, category } = req.body;
    if (!name || !category) return next(new AppErrors("name and category is required", 400));
    const existCategory = await SubCategory.findOne({ name, category });
    if (existCategory) return next(new AppErrors("category already exist", 400));
    // slugify makes a URL-friendly version of the name
    const subcategory = await SubCategory.create({ name, category, slug: slugify(name) });
  
    res.status(201).json({ data: subcategory });
  });

  // @desc get all categories
  // @route /subcategory
  // @access public
const getAllSubCategories = asyncHandler(async (req, res, next) => {
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 4
    const skip = (page-1)* limit;
    let filterCategory = {};
    if(req.params.categoryId) filterCategory = {category: req.params.categoryId}
   
    const subCategories = await SubCategory.find(filterCategory).skip(skip).limit(limit)
    if (subCategories.length === 0)
      return next(new AppErrors("not found category", 404));
    res.status(200).json({ result:subCategories.length, page , data: subCategories });
  });
  
  // @desc get single category
// @route /subcategory/:id
// @access public
  const getSingleSubCategores = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const getSubCategory = await SubCategory.findById(id);
    if(!getSubCategory) return next(new AppErrors("category not found", 404));
    res.status(200).json({data: getSubCategory})
  });

  
// @desc update single subCategory
// @route /subcategory/:id
// @access private
const updateSubCategory = asyncHandler(
    async (req, res, next)=> {
      const {id} = req.params;
      const {name, category} = req.body;
  if(!name )return next(new AppErrors("name  is require", 400))
      const  uPdate = await SubCategory.findByIdAndUpdate({_id:id}, {name, category , slug: slugify(name)}, {new:true})
    if(!uPdate) return next(new AppErrors("subcategory not found", 404))
      res.status(200).json({data:uPdate })
    }
  )
  
  // @desc delete single subCategory
  // @route /subcategory/:id
  // @access private
  
  const deletSubCategory = asyncHandler(
    async (req, res, next)=> {
      const {id} = req.params
      const deletedSubCategory = await SubCategory.findByIdAndDelete(id)
      if(!deletedSubCategory) return next( new AppErrors("subcategory not found", 404))
        res.status(200).json({message: "deleted successfuly"})
  
    }
  )
  

  module.exports = {
    createSubCategory,
    getAllSubCategories,
    getSingleSubCategores,
    updateSubCategory,
    deletSubCategory,
  }