// routes/adminRoutes.js
import express from "express"
import authUser from "../middleware/authMiddleware.js"
import isAdmin from "../middleware/isAdmin.js"
import { deleteCollection, deleteRecipe, deleteReview, deleteUser, getAllActivities, getAllCollections, getAllFavorites, getAllRecipes, getAllReviews, getAllUsers } from "../controllers/adminController.js"



const router = express.Router()

// User control
router.get("/users", authUser, isAdmin, getAllUsers)
router.delete("/users/:id", authUser, isAdmin, deleteUser)

// Recipe control
router.get("/recipes", authUser, isAdmin, getAllRecipes)
router.delete("/recipes/:id", authUser, isAdmin, deleteRecipe)

// Collection control
router.get("/collections", authUser, isAdmin, getAllCollections)
router.delete("/collections/:id", authUser, isAdmin, deleteCollection)

// Review control
router.get("/reviews", authUser, isAdmin, getAllReviews)
router.delete("/reviews/:id", authUser, isAdmin, deleteReview)

// Favorites
router.get("/favorites", authUser, isAdmin, getAllFavorites)

// Activities
router.get("/activities", authUser, isAdmin, getAllActivities)

export default router
