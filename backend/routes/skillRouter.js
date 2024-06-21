import express from "express";
import {
  addNewSkill,
  deleteSkill,
  getAllSkills,
  updateSkill,
} from "../controller/skillController.js";
import { isAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", isAuth, addNewSkill);
router.delete("/delete/:id", isAuth, deleteSkill);
router.put("/update/:id", isAuth, updateSkill);
router.get("/getall", getAllSkills);

export default router;
