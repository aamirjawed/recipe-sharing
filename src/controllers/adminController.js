// controllers/adminController.js
import User from "../models/userModel.js"
import Recipe from "../models/recipeModel.js"
import Collection from "../models/favouriteCollectionModel.js"
import Review from "../models/reviewModel.js"
import {FavoriteCollectionRecipe} from "../models/favoriteCollectionRecipeModel.js"
import Activity from "../models/activityModel.js"


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ["password"] } })
        res.json({ success: true, users })
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching users" })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        await User.destroy({ where: { id } })
        res.json({ success: true, message: "User deleted" })
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting user" })
    }
}


export const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll()
        res.json({ success: true, recipes })
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching recipes" })
    }
}

export const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params
        await Recipe.destroy({ where: { id } })
        res.json({ success: true, message: "Recipe deleted" })
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting recipe" })
    }
}


export const getAllCollections = async (req, res) => {
    try {
        const collections = await Collection.findAll()
        res.json({ success: true, collections })
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching collections" })
    }
}

export const deleteCollection = async (req, res) => {
    try {
        const { id } = req.params
        await Collection.destroy({ where: { id } })
        res.json({ success: true, message: "Collection deleted" })
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting collection" })
    }
}


export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll()
        res.json({ success: true, reviews })
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching reviews" })
    }
}

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params
        await Review.destroy({ where: { id } })
        res.json({ success: true, message: "Review deleted" })
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting review" })
    }
}


export const getAllFavorites = async (req, res) => {
    try {
        const favorites = await FavoriteCollectionRecipe.findAll()
        res.json({ success: true, favorites })
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching favorites" })
    }
}


export const getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.findAll({ order: [["createdAt", "DESC"]] })
        res.json({ success: true, activities })
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching activities" })
    }
}
