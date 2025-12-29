const express = require('express');
const router = express.Router();
const productcontroller = require("../controllers/Product.controllers")
const authcontroller = require("../controllers/auth.controller")
const authAdminMiddleware = require("../Middlewares/auth.middleware")
const chatmessage = require("../controllers/chatmessage.controller")
const multer = require("../Middlewares/multer.middleware")
const ordercontroller = require("../controllers/order.controller")



router.get("/adminprotaction", authAdminMiddleware.authAdminMiddleware, authcontroller.adminprotaction)
router.post("/products", multer.single("img"), productcontroller.creatnewproducts);
router.put("/products/update/:id", productcontroller.updateProduct);
router.get("/products", productcontroller.products)
router.delete("/products/delete/:id", productcontroller.deleteproduct)
router.post("/login", authcontroller.adminlogin)
router.post("/logout", authcontroller.adminlogout)
router.get("/message", chatmessage.recivemsg)
router.delete("/message/:id", chatmessage.deleteMessage)
router.get("/orders", ordercontroller.adminorder)
router.put("/order/status/:id", ordercontroller.adminstatusupdate)
router.delete("/order/delete/:id",ordercontroller.deleteorder)



module.exports = router;