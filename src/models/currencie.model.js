import {DataTypes} from "sequelize";
import sequelize from "../config/squeDB.js";

const Currencie = sequelize.define('Currencie',{
      currencie_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    code:{
        type:DataTypes.STRING(4),
        allowNull:false,
        unique:true

    },
    name:{
        type:DataTypes.STRING(50),
        allowNull: true,
    },

},
    {
    tableName: 'currencies',
        timestamps: true,


});

export default Currencie;