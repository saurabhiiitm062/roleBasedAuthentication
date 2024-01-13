const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../Models/userModel");

router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if email, password, and role are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email, password, and role are required" });
    }

    // Check if the email is already taken
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Check if the provided role is valid
    if (role && !["user", "moderator", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const hassedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new userModel({
      email,
      password: hassedPassword,
      role: role || "user", // Default to 'user' if role is not provided
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ email, role: user.role }, process.env.SECRET_KEY);

    const cookieoption = {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 24 * 1000,
      secure: true,
      sameSite: "None",
    };

    res.cookie("token", token, cookieoption);

    res.json({
      message: "Logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/user", authenticateRole("user"), (req, res) => {
  res.json({ message: "User route - Access granted" });
});

module.exports = router;
