import express from "express";
import {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipeById,
  searchRecipes,
  getMyRecipes,
} from "../controllers/recipeController.js";
import authUser from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";

const router = express.Router();


router.get("/get-my-recipes", authUser, getMyRecipes)


// Public
router.get("/", getAllRecipes);
router.get("/search", searchRecipes); 
router.get("/:id", getRecipeById);



// Protected
router.post("/", authUser, upload.single("image"), createRecipe);
router.put("/:id", authUser, updateRecipe);
router.delete("/:id", authUser, deleteRecipe);

export default router;
