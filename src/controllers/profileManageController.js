import User from "../models/userModel.js"
import bcrypt from 'bcryptjs'



export const profileManageController = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or unauthorized"
      });
    }

    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await user.update(updateData);

    const safeUser = user.toJSON();
    delete safeUser.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: safeUser
    });
  } catch (error) {
    console.error("Error in profileManageController:", error.message);
    res.status(500).json({
      success: false,
      message: "Error while updating user info"
    });
  }
};
