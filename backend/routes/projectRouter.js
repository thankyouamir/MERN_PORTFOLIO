import express from "express";
import {
  addNewProject,
  deleteProject,
  getAllProjects,
  getSingleProject,
  updateProject,
} from "../controller/projectController.js";
import { isAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", isAuth, addNewProject);
router.delete("/delete/:id", isAuth, deleteProject);
router.put("/update/:id", isAuth, updateProject);
router.get("/getall", getAllProjects);
router.get("/get/:id", getSingleProject);

export default router;
