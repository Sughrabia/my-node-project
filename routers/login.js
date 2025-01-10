const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/login");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send OTP email
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email with OTP",
    html: `<p>Your OTP for email verification is: <strong>${otp}</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Signup route
router.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = Math.floor(100000 + Math.random() * 900000); 
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

    user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    });

    await user.save();
    try {
      await sendOtpEmail(email, otp);
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError);
      await User.deleteOne({ email });
      return res.status(500).json({
        message: 'Failed to send OTP email. Please try registering again.',
      });
    }

    res.status(200).json({
      message: 'User registered successfully. Please check your email for OTP.',
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP route
router.post("/api/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Middleware to check if user is verified
const verifyUserMiddleware = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(403).json({ message: "User is not verified" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login route
router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  const otp = crypto.randomInt(100000, 999999).toString();

  try {
    await sendOtpEmail(email, otp);
    // Store the OTP somewhere (e.g., in memory, Redis, or a DB)
    // This is for later verification
    // Example: otpStore[email] = otp; 

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP. Please try again later." });
  }
});

module.exports = router;
