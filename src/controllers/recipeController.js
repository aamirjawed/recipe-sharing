import Recipe from "../models/recipeModel.js";
import User from "../models/userModel.js";
import Activity from "../models/activityModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Op } from "sequelize";


export const createRecipe = async (req, res) => {
    try {
        const { title, ingredients, instructions, dietaryPreference, difficulty, prepTime } = req.body;
        const userId = req.userId;

        if (!title || !ingredients || !instructions) {
            return res.status(400).json({
                success: false,
                message: "Title, ingredients, and instructions are required",
            });
        }

        let fileUrl = null;

        if (req.file) {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            if (cloudinaryResponse) {
                fileUrl = cloudinaryResponse.secure_url;
            }
        }

        // Create the recipe
        const recipe = await Recipe.create({
            title,
            ingredients,
            instructions,
            imageUrl: fileUrl,
            dietaryPreference,
            difficulty,
            prepTime,
            userId,
        });

        // Log activity for feed
        await Activity.create({
            type: "recipe_created",
            userId,
            recipeId: recipe.id,
            description: `Created a new recipe: "${recipe.title}"`,
        });

        return res.status(201).json({
            success: true,
            message: "Recipe created successfully",
            data: recipe,
        });
    } catch (error) {
        console.error("Error creating recipe:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating recipe",
        });
    }
};


export const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        
        const recipe = await Recipe.findOne({ where: { id, userId } });
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found or unauthorized",
            });
        }

        
        const {
            title,
            ingredients,
            instructions,
            imageUrl,
            dietaryPreference,
            difficulty,
            prepTime,
        } = req.body || {};

        const updates = {};

        if (title) updates.title = title;
        if (ingredients) updates.ingredients = ingredients;
        if (instructions) updates.instructions = instructions;
        if (dietaryPreference) updates.dietaryPreference = dietaryPreference;
        if (difficulty) updates.difficulty = difficulty;
        if (prepTime) updates.prepTime = prepTime;

        
        if (req.file) {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            if (cloudinaryResponse) {
                updates.imageUrl = cloudinaryResponse.secure_url;
            }
        } else if (imageUrl) {
            
            updates.imageUrl = imageUrl;
        }

        // If no fields provided
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided to update",
            });
        }

    
        await recipe.update(updates);

        // Log activity
        await Activity.create({
            type: "recipe_updated",
            userId,
            recipeId: recipe.id,
            description: `Updated recipe: "${recipe.title}"`,
        });

        return res.status(200).json({
            success: true,
            message: "Recipe updated successfully",
            data: recipe,
        });
    } catch (error) {
        console.error("Error updating recipe:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating recipe",
        });
    }
};



export const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const recipe = await Recipe.findOne({ where: { id, userId } });

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found or unauthorized",
            });
        }

        
        await Activity.create({
            type: "recipe_deleted",
            userId,
            recipeId: recipe.id, 
            description: `Deleted recipe: "${recipe.title}"`,
        });

        await recipe.destroy();

        return res.status(200).json({
            success: true,
            message: "Recipe deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting recipe:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting recipe",
        });
    }
};



export const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll({
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "fullName", "email"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            data: recipes,
            count: recipes.length,
        });
    } catch (error) {
        console.error("Error fetching all recipes:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching recipes",
        });
    }
};


export const getRecipeById = async (req, res) => {
    try {
        const { id } = req.params;

        const recipe = await Recipe.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "fullName", "email"],
                },
            ],
        });

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: recipe,
        });
    } catch (error) {
        console.error("Error fetching recipe by ID:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching recipe",
        });
    }
};


export const searchRecipes = async (req, res) => {
    try {
        const { q, dietaryPreference, difficulty, maxPrepTime } = req.query;

        let whereConditions = {};

        if (q && q.trim()) {
            whereConditions.title = { [Op.like]: `%${q.trim()}%` };
        }

        const validDietaryPreferences = ["vegetarian", "vegan", "gluten-free", "non-veg"];
        if (dietaryPreference && validDietaryPreferences.includes(dietaryPreference)) {
            whereConditions.dietaryPreference = dietaryPreference;
        }

        const validDifficulties = ["easy", "medium", "hard"];
        if (difficulty && validDifficulties.includes(difficulty)) {
            whereConditions.difficulty = difficulty;
        }

        if (maxPrepTime) {
            const maxTime = parseInt(maxPrepTime, 10);
            if (!isNaN(maxTime) && maxTime > 0) {
                whereConditions.prepTime = { [Op.lte]: maxTime };
            }
        }

        const recipes = await Recipe.findAll({
            where: whereConditions,
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "fullName", "email"],
                },
            ],
            order: [["createdAt", "DESC"]],
            limit: 100,
        });

        return res.status(200).json({
            success: true,
            count: recipes.length,
            data: recipes,
        });
    } catch (error) {
        console.error("Error searching recipes:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while searching recipes",
        });
    }
};
