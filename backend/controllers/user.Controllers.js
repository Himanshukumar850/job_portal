import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/Cloudinary.js";
import fs from "fs";

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
