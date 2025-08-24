import {DataTypes} from 'sequelize'
import sequelize from "../db/db-connection.js";
import User from './userModel.js';
import Recipe from './recipeModel.js';


const Review = sequelize.define("reviews", {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    rating:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{min:1, max:5}
    }
})

User.hasMany(Review, {foreignKey:"userId", onDelete:"CASCADE"})
Review.belongsTo(User, {foreignKey:"userId"})

Recipe.hasMany(Review, {foreignKey:"recipeId", onDelete:"CASCADE"})
Review.belongsTo(Recipe, {foreignKey:"recipeId"})


export default Review