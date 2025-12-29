const usermodal = require("../models/user.model")
const jwt = require("jsonwebtoken")

const authusermiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Please login to access this resource"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECREAT);

    const user = await usermodal.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Session expired, please login again"
    });
  }
};



const authAdminMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.admintoken

    if (!token) {
      return res.status(401).json({
        message: "Please login first"
      })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN)

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Access denied"
      })
    }

    req.admin = decoded


    next()

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token, please login again"
    })
  }
}

module.exports = {
  authusermiddleware,
  authAdminMiddleware
}
