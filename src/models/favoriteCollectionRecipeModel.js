import {DataTypes} from 'sequelize'
import sequelize from '../db/db-connection.js'
import FavoriteCollection from './favouriteCollectionModel.js'
import Recipe from './recipeModel.js'


const FavoriteCollectionRecipe = sequelize.define("favorite_collection_recipes", {})

FavoriteCollection.belongsToMany(Recipe, {through:FavoriteCollectionRecipe, foreignKey:"collectionId"})
Recipe.belongsToMany(FavoriteCollection, {through:FavoriteCollectionRecipe, foreignKey:"recipeId"})


export {FavoriteCollectionRecipe}