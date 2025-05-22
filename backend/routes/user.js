const registeruser = require("../controllers/authController");
const express=require("express")
const router=express.Router();
router.post("/registeruser",registeruser)
module.exports=router