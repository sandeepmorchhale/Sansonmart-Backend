const express = require("express")
const product = require("../models/product.modal")
const User = require("../models/user.model")


const userdeshbordpage = async (req, res) => {

    res.status(200).json({
        Message: "welcom to user deshboard",
        user: req.user
    })
}


const updateduserdata = async (req, res) => {

    try {

        const { address, mobilenumber } = req.body


        if (!address && !mobilenumber) {
           return res.status(400).json({
                success: false,
                Message: "data cant be empty"
            })
        }

        const user = await User.findByIdAndUpdate(req.user.id, { address: address, mobilenumber: mobilenumber }, { new: true, runValidators: true })

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "user is not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "data updated succesfully",
            user
        })

    } catch (error) {
        console.error("Backend Error:", error);
      return  res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
}


module.exports = {
    userdeshbordpage,
    updateduserdata
}