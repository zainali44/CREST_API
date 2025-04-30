import {DataTypes} from "sequelize";
import sequelize from "../config/squeDB.js";

const Transaction = sequelize.define("Transaction",{

    transaction_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    invoice_id:{
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    payment_method_id:{
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    status:{
        type:DataTypes.ENUM('pending','completed','failed'),
        allowNull:false,
    },
    processed_at:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    currencie:{
      type:DataTypes.STRING(4),
      allowNull:false,
    },
    metadata:{
        type:DataTypes.JSONB,
        allowNull:false
    }

},{
    tableName:"transactions",
                timestamps: true,


});

export default Transaction;