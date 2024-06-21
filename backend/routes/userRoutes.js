import express from 'express';
const router = express.Router();
import {forgetPassword, getUser, getUserPortfolio, login, register, resetPassword, updatePassword, updateProfile} from '../controller/userController.js';
import { logout } from '../controller/userController.js';
import { isAuth } from '../middlewares/auth.js';

router.post("/register",register);
router.post("/login",login);
router.get("/logout",isAuth,logout);

router.get("/me",isAuth,getUser);
router.put("/update/me",isAuth,updateProfile);
router.put("/update/password",isAuth,updatePassword);
router.get("/me/portfolio",getUserPortfolio);
router.post("/password/forgetpassword",forgetPassword);
router.put("/password/reset/:token",resetPassword);

export default router;