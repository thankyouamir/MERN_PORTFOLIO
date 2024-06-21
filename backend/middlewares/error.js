class ErrorHandler extends Error{
    //inheriting the error class to customize error
    constructor(message,statusCode){
        super(message);//passing message to parent constructor
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err,req,res,next)=>{
    err.message=err.message || "Internal Server Error";
    err.statusCode =err.statusCode || 500;
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        //Object.keys will return an array with the object keys name
        err=new ErrorHandler(message,400);
    }
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is Invalid !! Try Again .`;
        err=new ErrorHandler(message,400);
    }
    if(err.name === "TkenExpiredError"){
        const message = "Json Web Token is Expired !!";
        err=new ErrorHandler(message,400);
    }
    if(err.name === "CastError"){
        const message= `Invalid ${err.path}`;
        err=new ErrorHandler(message,400);
    }
    const errorMessage = err.errors? Object.values(err.errors).map ((error)=>error.message).join(" ") : err.message;
    //object.value will return an array with the value present in the object.
    return res.status(err.statusCode).json({
        //passing both status and json file as response
        success : false,
        message : errorMessage,
    })
}

export default ErrorHandler;