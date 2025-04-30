import {DataTypes} from "sequelize";
import sequelize from "../config/squeDB.js";
 const BankTransactionDetail = sequelize.define("BankTransactionDetail", {
        transaction_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "transactions",
                key: "transaction_id",
            },
        },
        merchant_amount:DataTypes.FLOAT,
        order_date: DataTypes.DATE,
        bill_number: DataTypes.STRING,
        payment_reference: DataTypes.STRING,
        customer_id: DataTypes.STRING,
        email_address: DataTypes.STRING,
        mobile_no: DataTypes.STRING,
        additional_info: DataTypes.JSONB
    });

export default BankTransactionDetail;