import express from 'express'
import authUser from '../middleware/authMiddleware.js'
import { addRecipeToCollection, createCollection, deleteCollection, getRecipesInCollection, getUserCollections, removeRecipeFromCollection } from '../controllers/favoriteCollectionRecipeController.js';


const router = express.Router();

router.use(authUser)


router.post("/",  createCollection)
router.post("/add", addRecipeToCollection);
router.get("/collections", getUserCollections);
router.get("/collections/:collectionId/recipes", getRecipesInCollection);
router.delete("/remove", removeRecipeFromCollection)
router.delete("/collections/:collectionId", deleteCollection)

export default router