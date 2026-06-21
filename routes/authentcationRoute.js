const express = require("express")
const router = express.Router();
const {register, login, refresh,logOut, resetPassword,verifyPssResetCode, resetNewPass} = require("../controllars/authentcationUsers")
const multer = require("multer")
const {verifyAdmin} = require("../middlewares/verifyAdmin")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })

router.post("/register",upload.single('image'), register)
router.post("/login", login)
router.post("/logout", logOut)
router.get("/refresh", refresh)
router.post("/reset-password", resetPassword)
router.post("/verify-code", verifyPssResetCode)
router.post("/create-new-password", resetNewPass)


module.exports = router