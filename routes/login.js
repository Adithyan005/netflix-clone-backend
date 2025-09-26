// import express from "express";
// import signupmodel from "../models/Signup.js";
// const router = express.Router();

// router.use(express.json())

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await signupmodel.findOne({ email });

//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     if (user.password === password) {
//       return res.json({ success: true, message: "Login successful" });
//     } else {
//       return res.json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// export default router;

import express from "express";
import signupmodel from "../models/Signup.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.use(express.json());

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Check if user exists
    const user = await signupmodel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Check secret
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: "Server configuration error: missing JWT secret" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed. Please try again later." });
  }
});

export default router;
