const AppError = require("../utils/AppErrors");
const jwt = require("jsonwebtoken");
const Users = require("../models/authentcationSchema");

exports.jwtToken = async (req, res, next) => {
  // get access token from headers
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  // extract token from header
  const token = authHeader.split(" ")[1];

  // check if headers access token match access token or not
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // check if user exist or not
    const findUser = await Users.findById(decoded.userInfo.id);
    if (!findUser)
      return next(new AppError("Invalid token or user not found", 401));
// check if password changed or not of changed after login return error 
    if (findUser.passwordChangedAt) {
      const timePasssword = parseInt(
        findUser.passwordChangedAt.getTime() / 1000,
        10
      );
      if (timePasssword > decoded.iat)
        return next(
          new AppError("Password changed recently. Please login again", 401)
        );
    }

    req.user = decoded.userInfo.id;
    
    next();
  } catch (err) {
    if (err) return next(new AppError("Forbidden", 403));
  }
};
