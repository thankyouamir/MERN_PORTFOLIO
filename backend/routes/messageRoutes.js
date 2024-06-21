import express from 'express';
import { isAuth } from '../middlewares/auth.js';
const router = express.Router();
import { deleteMessage, getAllMessages, sendMessage } from '../controller/messageController.js';

router.post("/send",sendMessage);
router.get("/getmessage",getAllMessages);
router.delete("/delmessage/:id",isAuth ,deleteMessage);



export default router;