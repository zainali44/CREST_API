import { DataTypes } from "sequelize";
import sequelize from "../config/squeDB.js";

const Plan = sequelize.define('Plan', {
    plan_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    billing_cycle: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
        allowNull: false,
    },
}, {
    tableName: 'plans',
    timestamps: true,
});

export default Plan;