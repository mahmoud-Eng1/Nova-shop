const SubCategory = require("../models/subCategorySchema")
const AppErrors = require("../utils/AppErrors")

/**
 * Ensure that all provided subCategories belong to the given category.
 * Prevents assigning subCategories to an unrelated category.
 */
  exports.checkSubCategoriesBelongToCategory = async (req, res, next)=> {
    
    let subCategory = req.body.subCategory
    if (!subCategory) return next();

    if(!Array.isArray(subCategory)){
      subCategory = subCategory ? [subCategory]: []
    } 

    const checkCategory = await SubCategory.find({_id: {$in: subCategory}, category: req.body.category})
    const checkSubCategoryDb = []
    checkCategory.forEach((ele)=> checkSubCategoryDb.push(ele._id.toString()))
    if (checkCategory.length !== subCategory.length) {
      return next(new AppErrors('subcategories not belong to category', 400));
    }
  
    next(); 
    
} 

/**
 * Validate that all provided subCategory IDs exist in the database
 * and that their count matches the request payload.
 */
exports.validateSubCategoryIds = async (req, res, next)=> {
    let subCategory = req.body.subCategory
      if (!subCategory) return next();
    if(!Array.isArray(subCategory)){
      subCategory = subCategory ? [subCategory]: []
    } 
    
// Validate that all subCategory IDs exist and match the provided count
const existSubCategory = await SubCategory.find({_id: {$exists: true, $in: subCategory}});
if(subCategory.length <1 || subCategory.length !== existSubCategory.length)
  return next(new AppErrors("subcategory not found or not same length count", 400))
next()
}