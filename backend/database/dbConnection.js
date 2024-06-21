import mongoose from "mongoose";
 const dbConnection = ()=>{
    //connect function takes port and options as parameter
    mongoose.connect(process.env.MONGO_URI,{
        dbName : "PORTFOLIO"
    }).then(()=>{
        console.log("Connected")
    }).catch((error)=>{
        console.log(`error : ${error}`)
    })
 };

 export default dbConnection;