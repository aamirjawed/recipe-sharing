import Follow from "../models/followModel.js";
import Activity from "../models/activityModel.js";
import User from "../models/userModel.js";
import { Op } from "sequelize";


export const followUser = async (req, res) => {
    try {
        const { followingId } = req.body;
        const followerId = req.userId;

        if (!followingId) {
            return res.status(400).json({
                success: false,
                message: "followingId is required",
            });
        }

        if (followerId === followingId) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself",
            });
        }

        const targetUser = await User.findByPk(followingId);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "The user you are trying to follow does not exist",
            });
        }

        const existingFollow = await Follow.findOne({
            where: { followerId, followingId },
        });

        if (existingFollow) {
            return res.status(400).json({
                success: false,
                message: "You are already following this user",
            });
        }

        const follow = await Follow.create({ followerId, followingId });

        // Log activity for feed
        await Activity.create({
            type: "follow",
            userId: followerId,
            description: `Started following user: "${targetUser.fullName}"`,
        });

        return res.status(201).json({
            success: true,
            message: "User followed successfully",
            data: follow,
        });
    } catch (error) {
        console.error("Error in followUser:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while following user",
        });
    }
};


export const unfollowUser = async (req, res) => {
    try {
        const { followingId } = req.body;
        const followerId = req.userId;

        if (!followingId) {
            return res.status(400).json({
                success: false,
                message: "followingId is required",
            });
        }

        const targetUser = await User.findByPk(followingId);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "The user you are trying to unfollow does not exist",
            });
        }

        const follow = await Follow.findOne({
            where: { followerId, followingId },
        });

        if (!follow) {
            return res.status(404).json({
                success: false,
                message: "You are not following this user",
            });
        }

        await follow.destroy();

        // Log activity for feed
        await Activity.create({
            type: "unfollow",
            userId: followerId,
            description: `Unfollowed user: "${targetUser.fullName}"`,
        });

        return res.status(200).json({
            success: true,
            message: "User unfollowed successfully",
        });
    } catch (error) {
        console.error("Error in unfollowUser:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while un following user",
        });
    }
};


export const getActivityFeed = async (req, res) => {
    try {
        const userId = req.userId;

        // Get all userIds that the current user is following
        const following = await Follow.findAll({
            where: { followerId: userId },
            attributes: ["followingId"],
        });

        const followingIds = following.map(f => f.followingId);

        if (followingIds.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No activities to show. You are not following anyone.",
                data: [],
                count: 0,
            });
        }

        // Fetch activities of followed users
        const activities = await Activity.findAll({
            where: { userId: { [Op.in]: followingIds } },
            include: [
                {
                    model: User,
                    attributes: ["id", "fullName"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            message: "Activity feed fetched successfully",
            data: activities,
            count: activities.length,
        });
    } catch (error) {
        console.error("Error in getActivityFeed:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching activity feed",
        });
    }
};
