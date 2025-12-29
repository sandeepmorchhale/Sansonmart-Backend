const express = require("express")
const router = express.Router()
const authcontroller = require("../controllers/auth.controller")


router.post("/user/register", authcontroller.registeruser)
router.post("/user/login", authcontroller.loginuser)
router.post("/user/logout", authcontroller.logoutuser)



module.exports = router
