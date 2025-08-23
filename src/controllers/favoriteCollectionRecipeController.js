import { FavoriteCollectionRecipe } from "../models/favoriteCollectionRecipeModel.js";
import FavoriteCollection from "../models/favouriteCollectionModel.js";
import Recipe from "../models/recipeModel.js";
import Activity from "../models/activityModel.js";


export const createCollection = async (req, res) => {
    try {
        const { name } = req.body || {};
        const userId = req.userId;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Collection name cannot be empty. Please enter a collection name"
            });
        }

        const collection = await FavoriteCollection.create({ name, userId });

        // Log in activity feed
        await Activity.create({
            type: "created collection",
            userId,
            description: `Created a new collection: "${collection.name}"`,
        });

        res.status(201).json({
            success: true,
            message: "New collection has been created",
            data: collection
        });

    } catch (error) {
        console.error("Error in create collection:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};


export const addRecipeToCollection = async (req, res) => {
    try {
        const { collectionId, recipeId } = req.body;
        const userId = req.userId;

        if (!recipeId) {
            return res.status(400).json({
                success: false,
                message: "Recipe ID is required"
            });
        }

        const recipe = await Recipe.findByPk(recipeId);
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found"
            });
        }

        let collection;
        if (!collectionId) {
            [collection] = await FavoriteCollection.findOrCreate({
                where: { userId, name: "My Favorites" },
            });
        } else {
            collection = await FavoriteCollection.findOne({
                where: { id: collectionId, userId }
            });
            if (!collection) {
                return res.status(404).json({
                    success: false,
                    message: "Selected collection not found"
                });
            }
        }

        const exists = await FavoriteCollectionRecipe.findOne({
            where: { collectionId: collection.id, recipeId }
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Recipe already in this collection"
            });
        }

        await FavoriteCollectionRecipe.create({ collectionId: collection.id, recipeId: recipe.id });

        // Log in activity feed
        await Activity.create({
            type: "added recipe to collection",
            userId,
            recipeId: recipe.id,
            description: `Added recipe "${recipe.title}" to collection "${collection.name}"`,
        });

        res.status(200).json({
            success: true,
            message: `Recipe "${recipe.title}" added to collection "${collection.name}"`,
            data: {
                collectionId: collection.id,
                collectionName: collection.name,
                recipeId: recipe.id,
                recipeTitle: recipe.title
            }
        });

    } catch (error) {
        console.error("Error in addRecipeToCollection:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while adding recipe to collection"
        });
    }
};


export const getUserCollections = async (req, res) => {
    try {
        const userId = req.userId;

        const collections = await FavoriteCollection.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({
            success: true,
            message: "User collections fetched successfully",
            data: collections,
            count: collections.length
        });
    } catch (error) {
        console.error("Error in getUserCollections:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching collections"
        });
    }
};


export const getRecipesInCollection = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const userId = req.userId;

        const collection = await FavoriteCollection.findOne({
            where: { id: collectionId, userId }
        });
        if (!collection) {
            return res.status(404).json({
                success: false,
                message: "Collection not found"
            });
        }

        const favorites = await FavoriteCollectionRecipe.findAll({ where: { collectionId } });

        const recipeIds = favorites.map(f => f.recipeId);

        const recipes = await Recipe.findAll({ where: { id: recipeIds } });

        res.status(200).json({
            success: true,
            message: `Recipes in collection "${collection.name}" fetched successfully`,
            data: recipes,
            count: recipes.length
        });
    } catch (error) {
        console.error("Error in getRecipesInCollection:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching recipes"
        });
    }
};


export const removeRecipeFromCollection = async (req, res) => {
    try {
        const { collectionId,recipeId } = req.params;
        const userId = req.userId;

        if (!collectionId || !recipeId) {
            return res.status(400).json({
                success: false,
                message: "Both collectionId and recipeId are required"
            });
        }

        const collection = await FavoriteCollection.findOne({
            where: { id: collectionId, userId:userId }
        });

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: "Collection not found"
            });
        }

        const favoriteEntry = await FavoriteCollectionRecipe.findOne({
            where: { collectionId, recipeId }
        });

        if (!favoriteEntry) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found in this collection"
            });
        }

        await favoriteEntry.destroy();

        // Log activity
        await Activity.create({
            type: "remvoe recipe from collection",
            userId,
            recipeId,
            description: `Removed recipe "${favoriteEntry.recipeId}" from collection "${collection.name}"`,
        });

        res.status(200).json({
            success: true,
            message: `Recipe removed from collection "${collection.name}" successfully`,
            data: {
                collectionId: collection.id,
                collectionName: collection.name,
                recipeId
            },
        });

    } catch (error) {
        console.error("Error in removeRecipeFromCollection:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while removing recipe from collection"
        });
    }
};

export const deleteCollection = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const userId = req.userId;

        if (!collectionId) {
            return res.status(400).json({
                success: false,
                message: "Collection ID is required"
            });
        }

        const collection = await FavoriteCollection.findOne({
            where: { id: collectionId, userId }
        }
        );

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: "Collection not found"
            });
        }

        await FavoriteCollectionRecipe.destroy({ where: { collectionId } });
        await collection.destroy();

        // Log activity
        await Activity.create({
            type: "delete_collection",
            userId,
            description: `Deleted collection "${collection.name}"`,
        });

        res.status(200).json({
            success: true,
            message: `Collection "${collection.name}" deleted successfully`,
            data: {
                collectionId: collection.id,
                collectionName: collection.name
            },
        });

    } catch (error) {
        console.error("Error in deleteCollection:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the collection"
        });
    }
};
