import { DataTypes } from "Sequelize";
import sequelize from "../db/db-connection.js";
import User from "./userModel.js";

const Recipe = sequelize.define("recipes", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ingredients: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true, // optional
  },
});

// Relation: 1 User -> Many Recipes
User.hasMany(Recipe, { foreignKey: "userId", onDelete: "CASCADE" });
Recipe.belongsTo(User, { foreignKey: "userId" });

export default Recipe;
