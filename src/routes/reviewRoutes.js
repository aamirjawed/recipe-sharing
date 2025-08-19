import express from "express"
import authUser from '../middleware/authMiddleware.js'
import { addOrUpdateReview, deleteReview, getReviewsByRecipe } from "../controllers/reviewController.js"

const router = express.Router()


router.use(authUser)

router.post("/", addOrUpdateReview)
router.get("/recipe/:recipeId", getReviewsByRecipe);
router.delete("/:reviewId", deleteReview);


export default router