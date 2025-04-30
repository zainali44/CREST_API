import {DataTypes, Transaction} from "sequelize";
import sequelize from "../config/squeDB.js";

const Invoice = sequelize.define('Invoice',{
    invoice_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,

    },
    subscription_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },

    amount_due:{
        type:DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    due_date:{
        type:DataTypes.DATE,
        allowNull:true,
    },
    status:{
        type:DataTypes.ENUM('paid','unpaid','overdue'),
        allowNull:false,
    },



},
    {
        tableName:'invoices',
            timestamps: true,

    });


export default Invoice;