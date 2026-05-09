const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
    }
);

// test koneksi
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database terkoneksi (Sequelize)!");
    } catch (error) {
        console.error("Gagal koneksi database:", error);
    }
})();

module.exports = sequelize;