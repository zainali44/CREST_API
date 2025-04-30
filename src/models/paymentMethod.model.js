import {DataTypes} from "sequelize";
import sequelize from "../config/squeDB.js";

const PaymentMethod =sequelize.define("PaymentMethod",{

    payment_method_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,

    },
    type:{
        type:DataTypes.STRING(20),
        allowNull:false,

    },
    details:{
        type:DataTypes.TEXT,
        allowNull:true,
    },


},
    {
        tableName:"payment_methods",
                    timestamps: true,

    }
    );
export default PaymentMethod;