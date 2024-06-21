import express from 'express';
import { isAuth } from '../middlewares/auth.js';

import {postTimeline,deleteTimeline,getAllTimelines} from '../controller/timelineController.js';
const router = express.Router();
router.post("/add",isAuth,postTimeline);
router.delete("/delete/:id",isAuth,deleteTimeline);
router.get("/getall",getAllTimelines);



export default router;