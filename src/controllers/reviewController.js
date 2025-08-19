import Recipe from "../models/recipeModel.js";
import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";
import Activity from "../models/activityModel.js";

// ==================== ADD OR UPDATE REVIEW ====================
export const addOrUpdateReview = async (req, res) => {
    try {
        const { recipeId, rating } = req.body;
        const userId = req.userId;

        if (!recipeId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Recipe ID and rating are required",
            });
        }

        const recipe = await Recipe.findByPk(recipeId);
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found",
            });
        }

        let review = await Review.findOne({ where: { recipeId, userId } });

        if (review) {
            review.rating = rating;
            await review.save();

            // Log activity for updating review
            await Activity.create({
                type: "review",
                userId,
                recipeId,
                description: `Updated review for recipe: "${recipe.title}"`,
            });

            return res.status(200).json({
                success: true,
                message: "Review updated successfully",
                data: review,
            });
        }

        review = await Review.create({ recipeId, userId, rating });

        // Log activity for adding new review
        await Activity.create({
            type: "review",
            userId,
            recipeId,
            description: `Added a new review for recipe: "${recipe.title}"`,
        });

        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            data: review,
        });
    } catch (error) {
        console.error("Error in add or update review:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while adding or updating review",
        });
    }
};

// ==================== GET REVIEWS BY RECIPE ====================
export const getReviewsByRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;

        const recipe = await Recipe.findByPk(recipeId);
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found",
            });
        }

        const reviews = await Review.findAll({
            where: { recipeId },
            include: [
                {
                    model: User,
                    attributes: ["id", "fullName", "email"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            message: `Reviews for recipe "${recipe.title}" fetched successfully`,
            data: reviews,
            count: reviews.length,
        });
    } catch (error) {
        console.error("Error in getReviewsByRecipe:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching reviews",
        });
    }
};

// ==================== DELETE REVIEW ====================
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.userId;

        if (!reviewId) {
            return res.status(400).json({
                success: false,
                message: "Review ID is required",
            });
        }

        const review = await Review.findOne({ where: { id: reviewId, userId } });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found or you are not authorized",
            });
        }

        const recipe = await Recipe.findByPk(review.recipeId);

        await review.destroy();

        // Log activity for deleting review
        await Activity.create({
            type: "review",
            userId,
            recipeId: review.recipeId,
            description: `Deleted review for recipe: "${recipe ? recipe.title : 'Unknown'}"`,
        });

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            data: { reviewId },
        });
    } catch (error) {
        console.error("Error in deleteReview:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting review",
        });
    }
};
