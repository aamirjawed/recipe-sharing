import express from "express";
import { followUser, getActivityFeed, unfollowUser } from "../controllers/socialController.js";
import authUser from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authUser);

// Follow a user
router.post("/follow", followUser);

// Unfollow a user
router.post("/unfollow", unfollowUser);

// Get activity feed
router.get("/feed", getActivityFeed);

export default router;
