import {DataTypes} from 'Sequelize'
import sequelize from '../db/db-connection.js'
import User from './userModel.js'

const Follow = await sequelize.define("follows", {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    followerId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },

    followingId:{
        type:DataTypes.INTEGER,
        allowNull:false

    }
})

User.hasMany(Follow, {foreignKey:"followerId", as:"following"})
User.hasMany(Follow, {foreignKey:"followingId", as:"followers"})

export default Follow