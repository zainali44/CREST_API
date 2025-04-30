import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/squeDB.js";

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isVerifiedEmail: {
      type:DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailToken: {
      type: DataTypes.TEXT,

    },
},
    {
        tableName:'users',
                    timestamps: true,

    }
    );

export default User;