import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js"; 
import crypto from "crypto";
import {v2 as cloudinary} from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";


export const register = catchAsyncErrors(async (req,res,next)=>{
    if(!req.files || Object.keys(req.files).length=== 0){
        return next(new ErrorHandler("Avatar and Resume Required ",400));
    }
    const {avatar ,resume} =req.files;
    const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(avatar.tempFilePath,{folder : "AVATARS"});
    if(!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error){
        console.error(
            "cloudinary error",
            cloudinaryResponseForAvatar.error || "Unknown Cloudinary Error"
        );
    }
    const cloudinaryResponseForResume = await cloudinary.uploader.upload(resume.tempFilePath,{folder : "RESUMES"});
    if(!cloudinaryResponseForResume || cloudinaryResponseForResume.error){
        console.error(
            "cloudinary error",
            cloudinaryResponseForResume.error || "Unknown Cloudinary Error"
        );
    }
    const {
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioURL,
        githubURL,
        instagramURL,
        facebookURL,
        twitterURL,
        linkedInURL,} = req.body;
    const user = await User.create({
            
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioURL,
        githubURL,
        instagramURL,
        facebookURL,
        twitterURL,
        linkedInURL,
        avatar :{
            public_id : cloudinaryResponseForAvatar.public_id,
            url : cloudinaryResponseForAvatar.secure_url,
        },
        resume :{
            public_id : cloudinaryResponseForResume.public_id,
            url : cloudinaryResponseForResume.secure_url,
        }
        });
       generateToken(user,"User Registred",201,res);
});
//log in controller
export const login = catchAsyncErrors( async(req,res,next)=>{
    const {email,password} =req.body;
    if(!email || !password){
        return next(new ErrorHandler("Email and password requires"));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("invalid email or password"));
    }
    const isPasswordMatch = await user.comparePassword(password)
    if(!isPasswordMatch){
        return next(new ErrorHandler("invalid password"));
    }

    generateToken(user,"Logged In ",200,res);
});

export const logout = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("cookie","",{
        //need to provide same option as it was during token creation otherwise it will not work
        expires : new Date(Date.now()),
        httpOnly : true,
        sameSite : "None",
        secure : true
    }).json({
        success : true,
        message : "logout successfully",
    });
});

export const getUser = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success :true,
        user,
    })
});

export const updateProfile =catchAsyncErrors(async(req,res,next)=>{
    const newUserData ={
        fullName : req.body.fullName,
        email : req.body.email,
        phone : req.body.phone,
        aboutMe : req.body.aboutMe,
        
        portfolioURL : req.body.portfolioURL,
        githubURL : req.body.githubURL,
        instagramURL : req.body.instagramURL,
        facebookURL : req.body.facebookURL,
        twitterURL : req.body.twitterURL,
        linkedInURL : req.body.linkedInURL,
    };
    if(req.files && req.avatar){
        const avatar =req.body.avatar;
        const user =await User.findById(req.user.id);
        const profileImageId = user.avatar.public_id;
        await cloudinary.uploader.destroy(profileImageId);
        const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(avatar.tempFilePath,{folder : "AVATARS"});
        if(!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error){
            console.error(
                "cloudinary error",
                cloudinaryResponseForAvatar.error || "Unknown Cloudinary Error"
            );
        }
        newUserData.avatar = {
            public_id : cloudinaryResponseForAvatar.public_id,
            url : cloudinaryResponseForAvatar.secure_url,
        }
    }
    if(req.files && req.resume){
        const resume =req.body.resume;
        const user =await User.findById(req.user.id);
        const resumeId = user.resume.public_id;
        await cloudinary.uploader.destroy(resumeId);
        const cloudinaryResponseForResume = await cloudinary.uploader.upload(resume.tempFilePath,{folder : "RESUMES"});
        if(!cloudinaryResponseForResume || cloudinaryResponseForResume.error){
            console.error(
                "cloudinary error",
                cloudinaryResponseForResume.error || "Unknown Cloudinary Error"
            );
        }
        newUserData.resume = {
            public_id : cloudinaryResponseForResume.public_id,
            url : cloudinaryResponseForResume.secure_url,
        }
    }
    const user =await User.findByIdAndUpdate(req.user.id,newUserData,{
        new : true,
        runValidators :true,
        useFindAndModify :false,
    })
    res.status(200).json({
        success : true,
        user,
        message : " Profile updated "
    })
})

export const updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const {currentPassword , newPassword , confirmNewPassword} =req.body;
    if(!currentPassword || !newPassword || !confirmNewPassword){
        return next (new ErrorHandler("please fill all fields",400));
    }
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(currentPassword);
    if(!isPasswordMatched){
        return next (new ErrorHandler("incorrect current password",400));
    }
    if(newPassword != confirmNewPassword){
        return next (new ErrorHandler("new password and confirm password does'nt match",400));
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
        success : true,
        message : "password updated"
    })
    
});

export const getUserPortfolio = catchAsyncErrors(async(req,res,next)=>{
    const id = "66cff9091ab2e93f38a80dd5";
    const user = await User.findById(id);
    res.status(200).json({
        success :true,
        user,
    })
});

export const forgetPassword = catchAsyncErrors(async(req,res,next)=>{
    const user =await User.findOne({email : req.body.email});
    if(!user){
        return next(new ErrorHandler("user not found",404));
    }
    const resetToken =user.getResetPasswordToken();
    await user.save({validateBeforeSave : false});
    const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
    const message =`your reset password token is : \n\n${resetPasswordUrl}\n\n if you have not request for this please ignore it.`;
    try{
        await sendEmail({
            email:user.email,
            subject : "personal portfolio dashboard recover password",
            message,
        });
        res.status(200).json({
            success  : true,
            message : `email sent to ${user.email} successfully`, 
        });
    }catch(error){
        user.resetPasswordExpire  = undefined;
        user.resetPasswordToken =undefined;
        await user.save();
        return next(new ErrorHandler(error.message,500));
    }

});

export const resetPassword = catchAsyncErrors(async (req,res,next)=>{
    const {token }= req.params;
    //destructuring
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()},
    });
    if(!user){
        return next(new ErrorHandler("invalid or expired ",400))
    };
    if(req.body.password != req.body.confirmNewPassword){
        return next(new ErrorHandler ("password fields does not match",400));
    }
    user.password =req.body.password;
    user.resetPasswordExpire =undefined;
    user.resetPasswordToken =undefined;
    await user.save();
    generateToken(user,"reset password successfully",200,res)
})
