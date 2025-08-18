import express from "express";
import {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipeById,
  searchRecipes,
} from "../controllers/recipeController.js";
import authUser from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllRecipes);
router.get("/search", searchRecipes);  // 👈 new endpoint
router.get("/:id", getRecipeById);

// Protected
router.post("/", authUser, upload.single("image"), createRecipe);
router.put("/:id", authUser, updateRecipe);
router.delete("/:id", authUser, deleteRecipe);

export default router;
