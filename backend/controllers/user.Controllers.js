import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/Cloudinary.js";
import fs from "fs";
import crypto from "crypto";
import { sendEmailAsync, getOtpEmailTemplate } from "../utils/emailService.js";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^(?:\+91|0)?[6-9]\d{9}$/;

// REGISTER
export const register = async (req, res) => {
  const uploadedFilePath = req.file ? req.file.path : null;
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Email validation
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
        success: false,
      });
    }

    // Phone number validation (Indian 10-digit mobile number)
    const cleanPhone = String(phoneNumber).trim().replace(/[\s-]/g, "");
    if (!PHONE_REGEX.test(cleanPhone)) {
      return res.status(400).json({
        message: "Please enter a valid 10-digit phone number (starts with 6-9)",
        success: false,
      });
    }
    const formattedPhoneNumber = cleanPhone.replace(/^(?:\+91|0)/, "");

    // Check if user exists FIRST before uploading to Cloudinary
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    let profilePicture = "";

    // Upload only if user does not exist
    if (req.file) {
      const cloudResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures",
      });
      profilePicture = cloudResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname: fullname.trim(),
      email: normalizedEmail,
      phoneNumber: formattedPhoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePicture,
      },
    });

    // Generate JWT token directly on signup (no re-login required)
    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      savedJobs: user.savedJobs || [],
    };

    const isProduction = process.env.NODE_ENV === "production";

    return res
      .status(201)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      })
      .json({
        message: "Account created successfully",
        user: userData,
        token,
        success: true,
      });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      message: error.message || "Server error",
      success: false,
    });
  } finally {
    // Clean up temporary local file from uploads/
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath);
      } catch (unlinkErr) {
        console.error("File cleanup error in register:", unlinkErr);
      }
    }
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
        success: false,
      });
    }

    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // Check role
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      savedJobs: user.savedJobs || [],
    };

    const isProduction = process.env.NODE_ENV === "production";

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: userData,
        success: true,
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: error.message || "Server error",
      success: false,
    });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      })
      .json({
        message: "Logged out successfully",
        success: true,
      });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      message: error.message || "Server error",
      success: false,
    });
  }
};

// UPDATE PROFILE (NO PASSWORD LEAK & SAFE FILE CLEANUP)
export const updateProfile = async (req, res) => {
  const uploadedFilePath = req.file ? req.file.path : null;
  try {
    const { fullname, phoneNumber, email, bio, skills } = req.body;
    const userId = req.id;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if new email is valid and not already taken by another user
    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      if (!EMAIL_REGEX.test(normalizedEmail)) {
        return res.status(400).json({
          message: "Please enter a valid email address",
          success: false,
        });
      }

      if (normalizedEmail !== user.email) {
        const existingEmail = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: userId },
        });
        if (existingEmail) {
          return res.status(400).json({
            message: "Email is already in use by another account",
            success: false,
          });
        }
        user.email = normalizedEmail;
      }
    }

    // File upload
    if (req.file) {
      const isDocument =
        req.file.mimetype.includes("pdf") ||
        req.file.mimetype.includes("document") ||
        req.file.mimetype.includes("msword");

      const cloudResponse = await cloudinary.uploader.upload(req.file.path, {
        resource_type: isDocument ? "raw" : "auto",
        folder: isDocument ? "resumes" : "profile_pictures",
      });

      if (!user.profile) {
        user.profile = {};
      }

      if (isDocument) {
        user.profile.resume = cloudResponse.secure_url;
        user.profile.resumeOrignalName = req.file.originalname;
      } else {
        user.profile.profilePicture = cloudResponse.secure_url;
      }
    }

    // Skills handling
    if (skills !== undefined) {
      const skillsArray = Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim()).filter(Boolean);
      if (!user.profile) user.profile = {};
      user.profile.skills = skillsArray;
    }

    // Update other fields
    if (fullname && fullname.trim()) user.fullname = fullname.trim();
    if (phoneNumber) {
      const cleanPhone = String(phoneNumber).trim().replace(/[\s-]/g, "");
      if (!PHONE_REGEX.test(cleanPhone)) {
        return res.status(400).json({
          message: "Please enter a valid 10-digit phone number (starts with 6-9)",
          success: false,
        });
      }
      user.phoneNumber = cleanPhone.replace(/^(?:\+91|0)/, "");
    }
    if (bio !== undefined) {
      if (!user.profile) user.profile = {};
      user.profile.bio = bio;
    }

    await user.save();

    // Security: exclude password from JSON response
    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;

    return res.status(200).json({
      message: "Profile updated successfully",
      user: sanitizedUser,
      success: true,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      message: error.message || "Server error",
      success: false,
    });
  } finally {
    // Always clean up local uploaded file from disk
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath);
      } catch (unlinkErr) {
        console.error("File cleanup error in updateProfile:", unlinkErr);
      }
    }
  }
};

// 1. FORGOT PASSWORD - Generate and Send 6-digit OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email address is required",
        success: false,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
        success: false,
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        message: "No account found with this email address",
        success: false,
      });
    }

    // Rate Limiting / Resend Cooldown (60 seconds)
    if (user.resetPasswordOTPExpires) {
      const timeRemaining = user.resetPasswordOTPExpires.getTime() - Date.now();
      // 10 minutes (600,000ms) total window. If more than 9 mins (540,000ms) remain, cooldown is active
      if (timeRemaining > 9 * 60 * 1000) {
        const waitSeconds = Math.ceil((timeRemaining - 9 * 60 * 1000) / 1000);
        return res.status(429).json({
          message: `Please wait ${waitSeconds} seconds before requesting a new code`,
          success: false,
        });
      }
    }

    // Generate secure 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Cryptographic SHA-256 hash (Zero plain-text in database)
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    // 10-minute expiry
    user.resetPasswordOTP = hashedOTP;
    user.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.resetPasswordAttempts = 0;
    await user.save();

    // Dispatch branded verification email asynchronously
    const emailHtml = getOtpEmailTemplate({
      userName: user.fullname,
      otp,
    });

    sendEmailAsync({
      to: user.email,
      subject: `${otp} is your Job Portal password reset code`,
      html: emailHtml,
      text: `Your password reset verification code is: ${otp}. It expires in 10 minutes.`,
    });

    return res.status(200).json({
      message: "Verification code sent to your email successfully",
      success: true,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to process forgot password request",
      success: false,
    });
  }
};

// 2. VERIFY RESET OTP
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and 6-digit verification code are required",
        success: false,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        message: "No account found with this email address",
        success: false,
      });
    }

    // Check if OTP was requested
    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res.status(400).json({
        message: "No active password reset request found. Please request a new code.",
        success: false,
      });
    }

    // Check expiration
    if (new Date() > user.resetPasswordOTPExpires) {
      return res.status(400).json({
        message: "Verification code has expired. Please request a new code.",
        success: false,
      });
    }

    // Check brute-force attempts (Max 5)
    if (user.resetPasswordAttempts >= 5) {
      user.resetPasswordOTP = null;
      user.resetPasswordOTPExpires = null;
      user.resetPasswordAttempts = 0;
      await user.save();

      return res.status(429).json({
        message: "Too many failed attempts. Code locked for security. Please request a new code.",
        success: false,
      });
    }

    // Verify cryptographic hash
    const hashedInput = crypto.createHash("sha256").update(cleanOtp).digest("hex");
    if (hashedInput !== user.resetPasswordOTP) {
      user.resetPasswordAttempts = (user.resetPasswordAttempts || 0) + 1;
      await user.save();
      const remainingAttempts = 5 - user.resetPasswordAttempts;
      return res.status(400).json({
        message: `Invalid verification code. ${remainingAttempts > 0 ? `${remainingAttempts} attempt(s) remaining.` : "Code locked."}`,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Code verified successfully! Please set your new password.",
      success: true,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to verify code",
      success: false,
    });
  }
};

// 3. RESET PASSWORD (Final step)
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, verification code, and new password are required",
        success: false,
      });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Strict security check: Re-verify OTP on password update to prevent API bypass
    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res.status(400).json({
        message: "No active password reset request found. Please request a new code.",
        success: false,
      });
    }

    if (new Date() > user.resetPasswordOTPExpires) {
      return res.status(400).json({
        message: "Verification code has expired. Please request a new code.",
        success: false,
      });
    }

    const hashedInput = crypto.createHash("sha256").update(cleanOtp).digest("hex");
    if (hashedInput !== user.resetPasswordOTP) {
      return res.status(400).json({
        message: "Invalid or expired verification code",
        success: false,
      });
    }

    // Hash new password securely
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and invalidate OTP
    user.password = hashedPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpires = null;
    user.resetPasswordAttempts = 0;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully! You can now log in with your new password.",
      success: true,
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to reset password",
      success: false,
    });
  }
};
