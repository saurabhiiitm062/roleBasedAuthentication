const express = require("express");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./db/dbconfig");
const authenticateRole = require("./middleware/authenticateRole");
const adminRouter = require("./routes/adminRoutes");
const moderatorRouter = require("./routes/moderatorRoutes");
const userRouter = require("./routes/userRoutes");
const dotenv = require("dotenv");

const app = express();
const PORT = 6000;
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(cookieparser());

connectDB().then(() => {
  console.log("Database connected");
});

// Middleware to authenticate user based on role

app.use("/", userRouter);

app.get("/moderator", authenticateRole("moderator"), moderatorRouter);

app.get("/admin", authenticateRole("admin"), adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
