const express = require("express")
const router = express.Router();
const {register, login, refresh,logOut, resetPassword,verifyPssResetCode, resetNewPass} = require("../controllars/authentCationUsers")
const multer = require("multer")
const {validateRegisterJoi, validateLoginJoi} = require("../middlewares/joiMiddleware.js")

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 4 * 1024 * 1024 }, 
});

  

router.post("/register",upload.single('image'), validateRegisterJoi, register)
router.post("/login", validateLoginJoi, login)
router.post("/logout", logOut)
router.get("/refresh", refresh)
router.post("/reset-password", resetPassword)
router.post("/verify-code", verifyPssResetCode)
router.post("/create-new-password", resetNewPass)


module.exports = router