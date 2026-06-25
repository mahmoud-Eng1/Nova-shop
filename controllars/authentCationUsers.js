const Users = require("../models/authentcationSchema")
const AppError = require("../utils/AppErrors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { createHmac } = require('node:crypto');
const sendEmail = require("../utils/sendEmail")
const createToken = require("../utils/createToken")
const asyncHandler = require("express-async-handler");



// @desc users register
// @route /users/register
// @access public
exports.register = asyncHandler( async (req, res, next)=> {
    const {first_name, last_name, password, email, confirm_password} = req.body
   
    if(req.file){
        req.body.image = req.file.filename
    }
    if(!first_name || !last_name || !email || !password || !confirm_password) return next(new AppError("all failds is required", 400))
        if(confirm_password !== password) return next(new AppError("confirm password dont match password", 400))
    const existUser = await Users.findOne({email}).exec() 
    if(existUser) return next(new AppError("User already exist", 400));
    const hashPassword = await bcrypt.hash(password, 12)
    let createUser = await Users.create({
        first_name, 
        last_name,
        email, 
       password: hashPassword,
       image: req.body.image,
       role: "user",
})
createUser.password = undefined

// access token
const accessToken = createToken(createUser, process.env.ACCESS_TOKEN_SECRET, "15m")

    //refresh token 
    const refreshToken = createToken(createUser, process.env.REFRESH_TOKEN_SECRET, "7d")

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

res.status(201).json({accessToken, user: createUser})

})

// @desc users login
// @route /users/login
// @access public
exports.login =asyncHandler( async (req, res, next)=> {
 const {email, password} = req.body
 const user = await Users.findOne({email}).select("+password -__v")
 if(!user) return next(new AppError("user not found", 400));
 const checkUser = await bcrypt.compare(password, user.password)
 if(!checkUser) return next( new AppError("Invalid credentials",401))
user.password = undefined
    // access token
    const accessToken = createToken(user, process.env.ACCESS_TOKEN_SECRET, "7d")

        // refresh token
        const refreshToken = createToken(user, process.env.REFRESH_TOKEN_SECRET, "7d")

    res.cookie("jwt", refreshToken ,{
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
        accessToken, 
        user
        
    })
})

// @desc refresh token
// @route /users/refresh
// @access public
exports.refresh = asyncHandler( (req, res, next)=> {
    const cookies = req.cookies
    // Check if JWT refresh token exists in cookies
    if(!cookies?.jwt) return next(new AppError("Unauthorized", 401))
          // Extract the refresh token from cookies
        const tokenCookies = cookies.jwt
         // Verify the refresh token
    jwt.verify(
        tokenCookies,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded)=> {
            // If token is invalid or expired
            if(err) return next(new AppError("forbidden", 403))
                // Find the user based on the ID stored in the token
                const user = await Users.findById(decoded.userInfo.id).exec();
                // If user does not exist in the database
            if(!user) return next(new AppError("Unauthorized", 401))
                  // Generate a new access token for the user
             const accessToken = jwt.sign({userInfo: {id: user._id}},
            process.env.ACCESS_TOKEN_SECRET,
             {expiresIn: "15m"}
            )

            return res.json({accessToken})

        }

    )
}
)
// @desc user logOut
// @route /users/logout
// @access public
exports.logOut = asyncHandler( (req, res, next) => {
const cookie = req.cookies
if(!cookie?.jwt) return res.status(204)
    res.clearCookie("jwt", {httpOnly: true, sameSite: "none", secure: true}),
res.json({ message: "Logged out successfully" });
})

// @desc send resetCode for user email
// @route /users/reset-password
// @access public
exports.resetPassword = asyncHandler( async (req, res, next)=> {
 const {email} = req.body
 const user = await Users.findOne({email})
 if(!user) return next(new AppError("there in no with that email", 404))
// generate a random number that includes 6 digits
 const codeNumber = Math.floor(100000 + Math.random() * 900000).toString()

// hashed reset code in database 
const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update(codeNumber)
               .digest('hex');
user.resetPassword = hash;
// set reset password code expiration time to 5 minutes from now
user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;
// if the user verified the reset code
user.resetPasswordVerify = false

await user.save();
try{
    const message = `<h2>Hi ${user.first_name}</h2>
  
  <p>
    We received a request to reset the password on your E-shop account.
  </p>

  <h2>${codeNumber}</h2> `

 sendEmail({
    email: user.email,
    subject: "your password reset code (valid for 5 min)",
    message
 }) 
}catch(err){
    user.resetPassword = undefined
    user.resetPasswordExpires = undefined
    user.resetPasswordVerify = undefined
    await user.save();
    return next(new AppError("there is an error in sending email", 500))
}

res.status(200).json({status: "Success", message: "reset code sent to email"})

} )

// @desc verify reset code
// @route /users/verify-code
// @access public
exports.verifyPssResetCode = asyncHandler( async (req, res, next)=> {
const {resetcode} = req.body
// hashed reset code to compare req.body with reset code in db
const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update(resetcode)
               .digest('hex');
const user = await Users.findOne({resetPassword:hash, resetPasswordExpires: {$gt: Date.now()}})
if(!user) return next(new AppError("Invalid or expired reset code", 400));
    user.resetPasswordVerify = true;
    await user.save
res.status(200).json({status: "Success"});

})

// @desc reset password
// @route /users/create-new-password
// @access public
exports.resetNewPass = asyncHandler( async (req, res, next)=> {
    // check by email if user exist in db or not
    const user = await Users.findOne({email:req.body.email})
    if(!user) return next(new AppError(`there is no user with email ${req.body.email} `,404));
    // check resetPasswordVerify = true or false if false the user not veify reset code
    if(!user.resetPasswordVerify) return next(new AppError("reset code not verified", 400));
    const hashedPassword = await bcrypt.hash(req.body.password , 12)
    user.password = hashedPassword
    await user.save()
// access token
const accessToken = createToken(user, process.env.ACCESS_TOKEN_SECRET, "15m")
res.status(200).json({token: accessToken})
})