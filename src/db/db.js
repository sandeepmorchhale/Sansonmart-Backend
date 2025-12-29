const mongoose = require("mongoose")

const mongodb = () => {

    mongoose.connect(process.env.MONGODB_URL)
        .then(() => { console.log("database connected sucesfully") })
        .catch((error) => { console.log("please chek your code your db is not connected", error) })
}

module.exports = mongodb