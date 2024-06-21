import {User} from "../models/userSchema.js";
import {catchAsyncErrors} from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
export const isAuth  =catchAsyncErrors(async(req,res,next)=>{
    const {cookie} =req.cookies;
    if(!cookie){
        return next(new ErrorHandler("User not identified",400))
    }
    const decoded = jwt.verify(cookie,process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();


});

