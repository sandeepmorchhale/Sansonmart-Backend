const usermodal = require("../models/user.model")
const jwt = require("jsonwebtoken")

const authusermiddleware = async (req, res, next) => {
  
  // 👇 1. DEBUGGING LOGS (Ye batayenge ki cookie aa rahi hai ya nahi)
  console.log("🔍 Incoming Request from:", req.headers.origin);
  console.log("🍪 Cookies Received on Server:", req.cookies); 

  const token = req.cookies.token;

  if (!token) {
    console.log("❌ Token Missing!"); // Log agar token nahi mila
    return res.status(401).json({
      message: "Please login to access this resource"
    });
  }

  try {
    // 👇 2. Spelling Check: JWT_SECREAT hi hona chahiye (.env file ke hisaab se)
    const decoded = jwt.verify(token, process.env.JWT_SECREAT);

    const user = await usermodal.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("❌ Token Verification Failed:", error.message); // Log agar verify fail hua
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
