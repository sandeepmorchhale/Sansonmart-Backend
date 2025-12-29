const mongoose = require("mongoose")


const userschema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true

    },
    mobilenumber: {
        type: String,
        require: true,
    },
    address:{
        type:String,
        require:true
    },

    password: {
        type: String
    }
}, {
    timestamps: true
})

const usermodal = mongoose.model("user", userschema)
module.exports = usermodal


