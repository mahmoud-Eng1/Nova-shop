const Users =require("../models/authentcationSchema.js")

const AppError = require("../utils/AppErrors.js")

const allowedto = (...roles)=> {
    return async (req, res, next)=> {
        const user = await Users.findById(req.user)
        if(!user) return next(new AppError("user not found", 404));
       
        if(!roles.includes(user.role)){
            return next(new AppError("Forbidden - you can not access this route", 403))
        }
        next()
    }

}

module.exports = allowedto