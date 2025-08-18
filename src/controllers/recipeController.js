import Recipe from "../models/recipeModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// CREATE a recipe
export const createRecipe = async (req, res) => {
  const { title, ingredients, instructions } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({
      success: false,
      message: "Title, ingredients, and instructions are required",
    });
  }

  try {
    let fileUrl = null;

    if (req.file) {
  console.log("Uploading file to Cloudinary:", req.file.path);
  const cloudinaryresponse = await uploadOnCloudinary(req.file.path);
  if (cloudinaryresponse) {
    fileUrl = cloudinaryresponse.secure_url;
    console.log("Final image URL:", fileUrl);
  } else {
    console.error("Cloudinary upload failed, fileUrl still null");
  }
}



    const recipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      imageUrl: fileUrl,
      userId: req.userId,
    });

    console.log("Uploaded file:", req.file);

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      data: recipe,
    });
  } catch (error) {
    console.error("Error creating recipe in recipe controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// EDIT (Update) recipe
export const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, ingredients, instructions, imageUrl } = req.body;

  try {
    const recipe = await Recipe.findOne({ where: { id, userId: req.userId } });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found or unauthorized",
      });
    }

    await recipe.update({ title, ingredients, instructions, imageUrl });

    res.json({ success: true, message: "Recipe updated", data: recipe });
  } catch (error) {
    console.error("Error updating recipe:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE recipe
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

// GET all recipes (for testing / feed)
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

// GET single recipe
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
