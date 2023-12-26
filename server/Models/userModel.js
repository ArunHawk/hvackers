import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    uName:{
        type:String,
        required: true,
    },
    uEmail: {
        type:String,
        required: true,
        unique:true
    },
    uPassword: {
        type:String,
        required: true,
    },
    uphoneNumber:{
        type:String,
        required: true,
    },
})

export default mongoose.model("userLogin",userSchema);