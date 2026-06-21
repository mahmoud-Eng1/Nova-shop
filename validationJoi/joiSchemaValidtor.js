const joi = require("joi")

 exports.productValidation = joi.object({
    title: joi.string().min(3).max(200).required(),
    slug: joi.string().required(),
    description: joi.string().required().min(10),
    quantity: joi.number().min(0).required(),
    sold: joi.number().min(0),
    price: joi.number().required(),
    priceAfterDiscount: joi.number().less(joi.ref("price")),

     images: joi.string().min(1),
    imageCover: joi.string(),
    ratingsAverage: joi.number().min(1).max(5),
    colors: joi.array().items(joi.string()),
    ratingsQuantity: joi.number()
 })

 exports.subCategoryValidation = joi.object({
   name: joi.string().required().min(2).max(32),
 })

 exports.brandValidation = joi.object({
   name: joi.string().required().min(3).max(32),
 })

 exports.joiUsersValidation = joi.object({
  first_name: joi.string().required(),
  last_name: joi.string().required(), 
  email: joi.string().required().email().trim(),
  password: joi.string().required().min(8).message("password is short must be above or equal 8")
 })

exports.joiCouponValidation = joi.object({
  name: joi.string().required().trim(),
  discount: joi.string().required(),
  expire: joi.date().required()
})

exports.joiReviewSchema = joi.object({
  rating: joi.number().min(1, "rating must be above or equal 1.0").max(5).message("rating must be below or equal 5.0")
})
