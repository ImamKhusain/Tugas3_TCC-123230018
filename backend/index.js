const express = require("express");
const sequelize = require("./config/database");
const notesRoutes = require("./routes/notesRoutes");
const cors = require("cors");

require("dotenv").config();

const app = express();

// FIX CORS (INI YANG PENTING)
app.use(cors());

// middleware
app.use(express.json());

// test endpoint
app.get("/", (req, res) => {
  res.send("API Notes berjalan!");
});

// register schema
require("./schema/Notes");

// routes
app.use("/api/v1/notes", notesRoutes);

// start server
const port = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(port, () => console.log(`Server running on port ${port}`));
});