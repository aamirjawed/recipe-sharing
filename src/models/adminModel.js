
import { DataTypes } from "sequelize";
import sequelize from "../db/db-connection.js";

const Admin = sequelize.define("admins", {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
        allowNull:false
    },
    fullName: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, unique: true 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false }
});

export default Admin;
