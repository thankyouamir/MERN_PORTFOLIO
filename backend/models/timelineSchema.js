import mongoose from "mongoose";


const timelineSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title  required'],
        
    },
    description :{
        type : String,
        required : [true,"description required"],
    },
    timeline : {
        from : {
            type : String,
            required :[true,"starting year required"],
        },
        to : {
            type : String,
            required :[true,"ending year required"],
        },
    },


})
export const Timeline = mongoose.model("Timeline" ,timelineSchema);