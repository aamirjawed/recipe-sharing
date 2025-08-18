import express from "express";
import { profileManageController } from "../controllers/profileManageController.js";
import authUser from "../middleware/authMiddleware.js";



const router = express.Router()


router.put('/manage-profile', authUser, profileManageController)


export default router