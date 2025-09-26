// import express from "express";
// import signupmodel from "../models/Signup.js";
// const router = express.Router();

// router.post("/signup", async (req, res) => {
//   //for signup
//   try {
//     const { email, password } = req.body;
//     const signup = new signupmodel({
//       email,
//       password,
//     });
//     await signup.save();
//     console.log(signup);
//     res.status(200).json({ message: "Successfully inserted" });
//   } catch (error) {
//     console.log("Error in inserting");
//   }
// });

// export default router;

import express from "express";
import signupmodel from "../models/Signup.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = await signupmodel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new signupmodel({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ success: false, message: "Signup failed. Please try again later." });
  }
});

export default router;
