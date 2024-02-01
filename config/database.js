import { Sequelize } from "sequelize";

const db = new Sequelize('arsip_sucofindo', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

export default db;