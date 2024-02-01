import { Sequelize } from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize;

const Data = db.define('data', {
    idData: {
        primaryKey: true,
        type: DataTypes.STRING,
        autoIncrement: false
    },
    noOrder: DataTypes.INTEGER,
    noSpk: DataTypes.INTEGER,
    namaPelanggan: DataTypes.STRING,
    subPortfolio: DataTypes.STRING,
    nilai: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    email: DataTypes.STRING,
    noHp: DataTypes.STRING
}, {
    freezeTableName: true
})

export default Data;

(async()=> {
    await db.sync();
})();