const {
  productValidation,
  brandValidation,
  subCategoryValidation,
  joiUsersValidation,
  joiCouponValidation,
  joiReviewSchema,
  joiLoginValidation,
} = require("../validationJoi/joiSchemaValidtor");
const AppErrors = require("../utils/AppErrors");

exports.validateProduct = (req, res, next) => {
  const { error } = productValidation.validate(req.body);
  if (error) return next(new AppErrors(error.details[0].message, 400));
  next();
};

exports.validationBrand = (req, res, next) => {
  const { error } = brandValidation.validate(req.body);
  if (error) return next(new AppErrors(error.details[0].message, 400));
  next();
};
exports.validationSubcategory = (req, res, next) => {
  const { error } = subCategoryValidation.validate(req.body);
  if (error) return next(new AppErrors(error.details[0].message, 400));
  next();
};
exports.validateRegisterJoi = (req, res, next) => {
  const { error } = joiUsersValidation.validate(req.body);
  if (error) return next(new AppErrors(error.details[0].message, 400));
  next();
};
exports.validateLoginJoi = (req, res, next) => {
  const { error } = joiLoginValidation.validate(req.body);
  if (error) return next(new AppErrors(error.details[0].message, 400));
  next();
};
exports.validateCouponJoi = (req, res, next) => {
  const { error } = joiCouponValidation.validate(req.body);
  if (error) return next(new AppErrors(error.details[0].message, 400));
  next();
};
exports.validateReviewJoi = (req, res, next) => {
  const { error } = joiReviewSchema.validate(req.body);
  if (error) return next(new AppErrors(error.details[0].message, 400));
  next();
};
