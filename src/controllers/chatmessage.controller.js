
const ChatMessage = require("../models/chatmessage.modal");

const sendMessage = async (req, res) => {
    try {
        const { name, email, mobile, message } = req.body;


        if (!name || !email || !mobile || !message) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const newMessage = new ChatMessage({
            name,
            email,
            mobile,
            message
        });

        await newMessage.save();

        res.status(201).json({
            message: "Message saved successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const recivemsg = async (req, res) => {

    try {
        const messages = await ChatMessage.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

const deleteMessage = async (req, res) => {

     try {
    const { id } = req.params;

    await ChatMessage.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete message"
    });
  }
    
}


module.exports = {
    sendMessage,
    recivemsg,
    deleteMessage
}
