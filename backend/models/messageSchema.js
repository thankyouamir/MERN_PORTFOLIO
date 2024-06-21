import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderName: {
        type: String,
        required: [true, 'Sender name is required'],
        minlength: [3, 'Sender name must be at least 3 characters long']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required']
    },
    message: {
        type: String,
        required: [true, 'Message is required']
    },
    createdAt : {
        type : Date,
        default : Date.now(),
    },

})
export const Message = mongoose.model("Message" ,messageSchema);