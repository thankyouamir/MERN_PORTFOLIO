import express from 'express';
import { isAuth } from '../middlewares/auth.js';

import {addNewApplication,deleteApplication,getAllApplications} from '../controller/softwareApplicationController.js';
const router = express.Router();
router.post("/add",isAuth,addNewApplication);
router.delete("/delete/:id",isAuth,deleteApplication);
router.get("/getall",getAllApplications);



export default router;