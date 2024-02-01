import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Data from "./DataModel.js";

const {DataTypes} = Sequelize;

const Arsip = db.define('arsip', {
    idArsip: {
        primaryKey: true,
        type: DataTypes.STRING,
        autoIncrement: false
    },
    idData: DataTypes.STRING,
    namaFile: DataTypes.STRING,
    tipeFile: DataTypes.STRING,
    files: DataTypes.STRING,
    url: DataTypes.STRING
}, {
    freezeTableName: true
})

Arsip.belongsTo(Data, { foreignKey: 'idData', as: "Data" })
Data.hasMany(Arsip, { foreignKey: 'idData' });

export default Arsip;

(async()=> {
    await db.sync();
})();