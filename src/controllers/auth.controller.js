const usermodel = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function registeruser(req, res) {
  const { name, email, password, address,mobilenumber, } = req.body

  const ifuserexist = await usermodel.findOne({
    email
  })
  if (ifuserexist) {
    return res.status(400).json({
      message: "user already exist"
    })
  }
  const salt = await bcrypt.genSalt(10)
  const hasepass = await bcrypt.hash(password, salt)

  const user = await usermodel.create({
    name,
    email,
    mobilenumber,
    address,
    password: hasepass
  })
  res.status(201).json({
    message: "user registerd successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobilenumber,
      address:user.address,
    }
  })
}
async function loginuser(req, res) {

  const { name, email, password } = req.body

  const ifuserexist = await usermodel.findOne({
    email
  })
  if (!ifuserexist) {
    res.status(400).json({
      message: "your email or password wrong"
    })
  }
  const validpass = await bcrypt.compare(password, ifuserexist.password)
  if (!validpass) {
    return res.status(400).json({
      message: "your email or password wrong"
    })
  }
  const token = jwt.sign({ id: ifuserexist._id }, process.env.JWT_SECREAT)
  res.cookie("token", token)

  res.status(200).json({
    message: "login successfully",
    user: {
      id: ifuserexist._id,
      name: ifuserexist.name,
      email: ifuserexist.email,
    }
  })
}

function logoutuser(req, res) {
  // Settings MUST match the login cookie settings
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,      // 👈 Change to true
    sameSite: "none"   // 👈 Change to "none"
  });

  res.status(200).json({
    message: "your log out successfully"
  });
}


const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ message: "Invalid admin email" });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid admin password" });
    }

    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET_ADMIN,
      { expiresIn: "1d" }
    );

    // 👇 FOR DEPLOYMENT (Render + Vercel)
    res.cookie("admintoken", token, {
      httpOnly: true,
      secure: true,       // 👈 Change to true
      sameSite: "none",   // 👈 Change to "none"
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Admin login successful"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


const adminlogout = (req, res) => {
  try {
    // Settings MUST match admin login settings
    res.clearCookie("admintoken", {
      httpOnly: true,
      secure: true,      // 👈 Change to true
      sameSite: "none"   // 👈 Change to "none"
    });

    return res.status(200).json({
      message: "Admin logout successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
      error: error.message
    });
  }
};


const adminprotaction = async (req, res) => {

  res.status(200).json({
    success: true,
    admin: req.admin
  })

}

const userprotaction = async (req, res) => {

  res.status(200).json({
    success: true,
    user: req.user
  })

}








module.exports = {
  registeruser,
  loginuser,
  logoutuser,
  adminlogin,
  adminlogout,
  adminprotaction,
  userprotaction

}