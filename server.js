require("dotenv").config()
const app = require("./src/app")
const mongodb = require("./src/db/db")


mongodb()

app.listen(process.env.PORT, () => {
    console.log("server is started")
})


