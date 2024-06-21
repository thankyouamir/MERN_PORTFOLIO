export const catchAsyncErrors = (theFunction)=>{
    // to handle async function error if the issue resolve then it will return the res otherwise through catch next middleware will be called
    //also error will be passed to the new middleware
    return (req,res,next)=>{
        Promise.resolve(theFunction(req,res,next)).catch(next);
    }
};

