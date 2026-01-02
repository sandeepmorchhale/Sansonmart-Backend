const express = require("express");
const router = express.Router();
const paymentcontroller = require("../controllers/payment.controller");
const authmiddleware = require("../Middlewares/auth.middleware")

// Create Order Route
router.post("/create-order", paymentcontroller.onlinepayment);

// Verify Payment Route
router.post("/verify-payment",paymentcontroller.verifyPayment);

module.exports = router;