import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauriData.js";
import cloudinary from "../utils/Cloudinary.js";
import fs from "fs";


//  REGISTER 
// export const register = async (req, res) => {
//   try {

//     const { fullname, email, phoneNumber, password, role } = req.body;

//     if (!fullname || !email || !phoneNumber || !password || !role) {
//       return res.status(400).json({
//         message: "All fields are required",
//         success: false,
//       });
//     }
//     const file = req.file;
//     const fileUri = getDataUri(file);
//     const cloudResponse = await cloudinary.uploader.upload(fileUri.content);


//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         message: "User already exists with this email",
//         success: false,
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     await User.create({
//       fullname,
//       email,
//       phoneNumber,
//       password: hashedPassword,
//       role,
//       profile:{
//         profilePicture:cloudResponse.secure_url, 
//       }
//     });

//     return res.status(201).json({
//       message: "Account created successfully",
//       success: true,
//     });

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Server error",
//       success: false,
//     });
//   }
// };

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const file = req.file;

    let profilePicture = ""; 

    if (file) {
      const cloudResponse = await cloudinary.uploader.upload(file.path); 
      profilePicture = cloudResponse.secure_url;
    }


    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePicture,
      },
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};



//  LOGIN 
export const login = async (req, res) => {
  try {


    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    let user = await User.findOne({ email });
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
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};



// ================= LOGOUT =================
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
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};



// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
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

    


    let cloudResponse;

    if (req.file) {
      cloudResponse = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
        folder: "resumes"
      });

      fs.unlinkSync(req.file.path); // 🧹 local file delete
    }




    // skills
    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    // update fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    if (!user.profile) {
      user.profile = {}; 
    }

    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    // resume
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOrignalName = req.file.originalname;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });

  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

