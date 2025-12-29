const express = require("express")
const router = express.Router()
const authmiddleware = require("../Middlewares/auth.middleware")
const usercontroller = require("../controllers/user.controllers")
const productcontroller = require("../controllers/Product.controllers")
const authcontroller = require("../controllers/auth.controller")
const userchat = require("../controllers/chatmessage.controller")
const ordercontroller = require("../controllers/order.controller")
const cartcontroller = require("../controllers/cart.controller");




router.get("/userprotaction", authmiddleware.authusermiddleware, authcontroller.userprotaction)
router.get("/profile", authmiddleware.authusermiddleware, usercontroller.userdeshbordpage)
router.get("/products", productcontroller.products)
router.post("/chat/send", userchat.sendMessage);
router.get("/orders", authmiddleware.authusermiddleware, ordercontroller.getMyOrders);
router.post("/order/new", authmiddleware.authusermiddleware, ordercontroller.newOrder);
router.post("/cart/add", authmiddleware.authusermiddleware, cartcontroller.addToCart);
router.get("/cart/get", authmiddleware.authusermiddleware, cartcontroller.getCart);
router.delete("/cart/remove/:id", authmiddleware.authusermiddleware, cartcontroller.removeCartItem);
router.put("/update-userdata", authmiddleware.authusermiddleware, usercontroller.updateduserdata)



module.exports = router
