import Recipe from "../models/recipeModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Op, Sequelize } from "sequelize";
import User from "../models/userModel.js";


// ===============================
// CREATE a recipe
// ===============================
export const createRecipe = async (req, res) => {
  const { title, ingredients, instructions, dietaryPreference, difficulty, prepTime } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({
      success: false,
      message: "Title, ingredients, and instructions are required",
    });
  }

  try {
    let fileUrl = null;

    if (req.file) {
      const cloudinaryresponse = await uploadOnCloudinary(req.file.path);
      if (cloudinaryresponse) {
        fileUrl = cloudinaryresponse.secure_url;
      }
    }

    const recipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      imageUrl: fileUrl,
      dietaryPreference,
      difficulty,
      prepTime,
      userId: req.userId,
    });

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      data: recipe,
    });
  } catch (error) {
    console.error("Error creating recipe:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ===============================
// UPDATE (Edit) recipe
// ===============================
export const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, ingredients, instructions, imageUrl, dietaryPreference, difficulty, prepTime } = req.body;

  try {
    const recipe = await Recipe.findOne({ where: { id, userId: req.userId } });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found or unauthorized",
      });
    }

    let fileUrl = imageUrl; // keep old image unless new uploaded

    if (req.file) {
      const cloudinaryresponse = await uploadOnCloudinary(req.file.path);
      if (cloudinaryresponse) {
        fileUrl = cloudinaryresponse.secure_url;
      }
    }

    await recipe.update({
      title,
      ingredients,
      instructions,
      imageUrl: fileUrl,
      dietaryPreference,
      difficulty,
      prepTime,
    });

    res.json({ success: true, message: "Recipe updated", data: recipe });
  } catch (error) {
    console.error("Error updating recipe:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ===============================
// DELETE recipe
// ===============================
export const deleteRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await Recipe.findOne({ where: { id, userId: req.userId } });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found or unauthorized",
      });
    }

    await recipe.destroy();

    res.json({ success: true, message: "Recipe deleted" });
  } catch (error) {
    console.error("Error deleting recipe:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ===============================
// GET all recipes
// ===============================
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: ["user"],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: recipes });
  } catch (error) {
    console.error("Error fetching recipes:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ===============================
// GET single recipe by ID
// ===============================
export const getRecipeById = async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await Recipe.findByPk(id, { include: ["user"] });

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    res.json({ success: true, data: recipe });
  } catch (error) {
    console.error("Error fetching recipe:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// SEARCH + FILTER recipes


export const searchRecipes = async (req, res) => {
  try {
    const { q, dietaryPreference, difficulty, maxPrepTime } = req.query;

    let whereConditions = {};

    // Safe text search using Sequelize operators
    if (q && q.trim()) {
      const searchTerm = q.trim();
      whereConditions.title = {
        [Op.like]: `%${searchTerm}%` 
      };
    }

    // Validate and filter dietary preference
    const validDietaryPreferences = ['vegetarian', 'vegan', 'gluten-free', 'non-veg'];
    if (dietaryPreference && validDietaryPreferences.includes(dietaryPreference)) {
      whereConditions.dietaryPreference = dietaryPreference;
    }

    // Validate and filter difficulty
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (difficulty && validDifficulties.includes(difficulty)) {
      whereConditions.difficulty = difficulty;
    }

    // Validate and filter max prep time
    if (maxPrepTime) {
      const maxTime = parseInt(maxPrepTime, 10);
      if (!isNaN(maxTime) && maxTime > 0) {
        whereConditions.prepTime = {
          [Op.lte]: maxTime
        };
      }
    }

    const recipes = await Recipe.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 100, 
    });

    res.json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};


