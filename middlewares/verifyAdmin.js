const Users =require("../models/authentcationSchema.js")

const AppError = require("../utils/AppErrors")
exports.verifyAdmin = async (req, res, next)=> {

const user = await Users.findById(req.user)
if(!user || user.role !== "admin") return next(new AppError("Forbidden - Admin only", 403))
next()
}