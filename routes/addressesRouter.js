const express = require("express");
const router = express.Router();
const {createAddresses, deleteAddress, getAllAddresses} = require("../controllars/addressesController");
const allowedto = require("../middlewares/allowedTo")
const {jwtToken} =require("../middlewares/verifyToken")
router.use(jwtToken, allowedto("user"))
router.post("/", createAddresses);
router.delete("/:id", deleteAddress);
router.get("/", getAllAddresses)

module.exports = router