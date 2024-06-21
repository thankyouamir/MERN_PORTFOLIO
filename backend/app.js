import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import dbConnection from './database/dbConnection.js';
import{errorMiddleware} from './middlewares/error.js';
import messageRouter from './routes/messageRoutes.js';
import userRouter from './routes/userRoutes.js';
import timelineRouter from './routes/timelineRoutes.js';
import skillRouter from './routes/skillRouter.js';
import softwareApplicationRouter from './routes/skillRouter.js';
import projectRouter from './routes/projectRouter.js';
//instance of express created
const app = express();
// const cors = require('cors');

dotenv.config({path :"./config/config.env"});
console.log(process.env.PORT);
//frontedn with backend connection
app.use(cors({
    origin : [process.env.PORTFOLIO_URL,process.env.DASHBOARD_URL],
    methods : ["GET","POST" ,"DELETE" ,"PUT"],
    credentials : true,
}))
//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp/",

}));

app.use("/api/v1/message",messageRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/timeline",timelineRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/softwareapplication", softwareApplicationRouter);
app.use("/api/v1/project", projectRouter);

dbConnection();
app.use(errorMiddleware);

export default app;