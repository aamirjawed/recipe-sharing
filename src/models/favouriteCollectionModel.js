import {DataTypes} from 'sequelize'
import sequelize from '../db/db-connection.js'
import User from './userModel.js'


const FavoriteCollection = sequelize.define("favorite_collection", {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

User.hasMany(FavoriteCollection, {foreignKey:"userId", onDelete:"CASCADE"})
FavoriteCollection.belongsTo(User, {foreignKey:"userId"})


export default FavoriteCollection