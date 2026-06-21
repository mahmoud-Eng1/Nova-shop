const express = require("express");
const router = express.Router()
const {getAllUsers, 
  getSingleUser, 
  updateUser, 
  deleteUser, 
  updatePassword, 
  addAdmin} = require("../controllars/usersControllar");
  const {verifyAdmin} = require("../middlewares/verifyAdmin")
  const {jwtToken} = require("../middlewares/verifyToken")
const multer = require("multer")

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
  router.patch("/:id", jwtToken, upload.single('image'), updateUser) 
  router.patch("/:id/password", jwtToken ,updatePassword)
  
router.use(jwtToken, verifyAdmin)
router.get("/", getAllUsers)
router.patch("/add-admin/:id",addAdmin) 
router.get("/:id",  getSingleUser)
router.delete("/:id", deleteUser)

module.exports = router