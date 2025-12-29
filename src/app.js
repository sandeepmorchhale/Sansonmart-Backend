const express = require("express")
const app = express()

app.set("trust proxy", 1); 

const cookieParser = require("cookie-parser")
const authroute = require("./routes/auth.routes")
const userroute = require("./routes/user.routes")
const adminrouter = require("./routes/admin.routes")

const cors = require("cors")

app.use(cors({
   origin: ["http://localhost:5173", "https://sansonmart-frontend.vercel.app"],
   methods: ["GET", "POST", "PUT", "DELETE"],
   credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/api/auth", authroute)
app.use("/api/user", userroute)
app.use("/api/admin", adminrouter)
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.send("hellow i am comming ")
})

module.exports = app