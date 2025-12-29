const product = require("../models/product.modal")
const fs = require("fs")
const imagekit = require("../../imagekit")





// const creatnewproducts = async (req, res) => {

//     try {
//         const Product = await product.create(req.body)

//          if (!req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Image is required"
//             });
//         }

//         // STEP 1 → Local file read karo
//         const fileData = fs.readFileSync(req.file.path);

//         res.status(201).json({
//             message: "product created successfully",
//             product: Product,
//         })
//     } catch (err) {
//         return res.status(500).json({
//             message: "internal server error",
//             error: err.message
//         })
//     }
// }



/////////////////////////////////////////////



const creatnewproducts = async (req, res) => {
    try {
        console.log("Body:", req.body);
        console.log("File:", req.file);

        const { name, stock, village, price, img, contact, veriety, packaging, description } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        // STEP 1 → Local file read karo
        const fileData = fs.readFileSync(req.file.path);

        // STEP 2 → ImageKit pe upload karo
        const uploaded = await imagekit.upload({
            file: fileData,
            fileName: Date.now() + "-" + req.file.originalname
        });

        // uploaded.url = permanent CDN URL
        // uploaded.fileId = file delete karne me kaam aayega

        const newItem = new product({
            img: uploaded.url,      // ❗ Ab filename nahi, URL save hoga
            name,
            description,
            stock,
            village,
            contact,
            price,
            veriety,
            packaging,

        });

        await newItem.save();

        res.json({
            success: true,
            message: "Item saved successfully!",
            imageUrl: uploaded.url  // optional — response me bhi de rahe
        });

    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};







/////////////////////////////////////////////








const products = async (req, res) => {
    try {
        const products = await product.find();

        res.status(200).json({
            message: "User products fetched successfully",
            products
        });

    } catch (err) {
        res.status(500).json({
            message: "Try again",
            error: err.message
        });
    }
}
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.json({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (err) {
        res.status(500).json({
            message: "Try again",
            error: err.message
        });
    }
};
const deleteproduct = async (req, res) => {
    try {
        const deletedItem = await product.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
module.exports = {

    creatnewproducts,
    updateProduct,
    products,
    deleteproduct
}
