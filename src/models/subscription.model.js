import { DataTypes } from "sequelize";
import sequelize from "../config/squeDB.js";

const Subscription = sequelize.define('Subscription', {
    subscription_id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active','inactive','cancelled','expired'),
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    next_billing_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },

}, {
    tableName: 'subscriptions',
                timestamps: true,

});

export default Subscription;