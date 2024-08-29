import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new mongoose.Schema({
    fullName : {
        type :String,
        required : [true,"Name Required"],
    },
    email :{
        type :String,
        required : [true,"Email required"],
    },
    phone : {
        type : String,
        required:[true,"number required"],
    },
    aboutMe:{
        type : String,
        required :[true,"about me required"],
    },
    password :{
        type : String,
        required : [true,"password required"],
        minlength : [8,"must contain atleast 8 characters"],
        select : false,
    },
    avatar :{
        public_id : {
            type : String,
            required: true,
        },
        url :{
            type : String,
            required : true,
        },
    },
    resume :{
        public_id :{
            type : String,
            required : true,
        },
        url :{
            type : String,
            required : true,
        },
    },
    portfolioURL :{
        type : String,
        required : [true,"url is required"],
    },
    githubURL : String,
    instagramURL : String,
    facebookURL : String,
    twitterURL : String,
    linkedInURL : String,
    resetPasswordToken : String,
    resetPasswordExpire : Date,
});
//password hashing using bcrypt
// next primary purpose is to control flow to the next middleware function or to complete the Mongoose operation.
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        //isModified check whether the password has been changed or not from last save or after initialization
        next();
    };
    this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods.comparePassword = async function (enteredPassword){
    //comparePassword instance  method created into userSchema
    return await bcrypt.compare(enteredPassword,this.password);
};

//jsonwebtoken generation
userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({id : this._id},process.env.JWT_SECRET_KEY,{expiresIn : process.env.JWT_EXPIRES});
};
userSchema.methods.getResetPasswordToken = function(){
    const resetToken =crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash ("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now()+15*60*1000;
    return resetToken;
}
export const User = mongoose.model("User",userSchema);
