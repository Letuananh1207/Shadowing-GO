const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const unitRoutes = require("./routes/unitRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// Cho phép tất cả origin
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/units", unitRoutes);

module.exports = app;
