import { DataTypes } from "sequelize";
import sequelize from "../db/db-connection.js";
import User from "./userModel.js";
import Recipe from "./recipeModel.js";

const Activity = sequelize.define("activities", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    recipeId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

// Relations

// A user can have many activities
User.hasMany(Activity, { foreignKey: "userId" });
Activity.belongsTo(User, { foreignKey: "userId" });

// A recipe can have many activities (like being favorited or reviewed)
Recipe.hasMany(Activity, { foreignKey: "recipeId" });
Activity.belongsTo(Recipe, { foreignKey: "recipeId" });

export default Activity;
