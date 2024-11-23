const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

// For sending OTP to the user via email
const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email.");
  }
};

// Register user and send OTP
exports.registerUser = async (req, res) => {
  const { name, mobile, email, referralCode } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Create a new user object
    const newUser = new User({
      name,
      mobile,
      email,
      otp,
      isReferred: !!referralCode,
      googleId: null,
    });

    await newUser.save();
    await sendOtpEmail(email, otp); // Send OTP via email

    res.status(200).json({ message: "OTP sent to your email", email });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

//Login-otp

exports.LoginOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }); // Use findOne instead of find
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await sendOtpEmail(email, otp); // Send OTP via email
    
    user.otp = otp;
    await user.save();

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};


// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.isLoggedIn = true;
    user.lastLoginTime = new Date();
    user.otp = "";

    await user.save();

    res.status(200).json({
      message: "OTP verified successfully",
      isLoggedIn: user.isLoggedIn,
      userId: user.userId,
    });

    await user.save();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

// Resend OTP functionality
exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;

    await user.save();
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error resending OTP", error: error.message });
  }
};

// Check login status on website load
exports.checkLoginStatus = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentTime = new Date();
    const lastLoginTime = new Date(user.lastLoginTime);

    // Calculate the difference in minutes
    const timeDifference = (currentTime - lastLoginTime) / (1000 * 60);

    // If the time difference is greater than 3 minutes, update isLoggedIn to false
    if (timeDifference > 3) {
      user.isLoggedIn = false;
      await user.save();

      // Update the local storage on the client side
      res.status(200).json({
        message: "Session expired, user is now logged out.",
        isLoggedIn: user.isLoggedIn,
      });
    } else {
      res.status(200).json({
        message: "User is still logged in.",
        isLoggedIn: user.isLoggedIn,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking login status", error: error.message });
  }
};
