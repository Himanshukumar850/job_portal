

import Company from "../models/company.js";
import getDataUri from "../utils/datauriData.js";
import cloudinary from "../utils/Cloudinary.js";

// REGISTER
export const registerCompany = async (req, res) => {
  try {
    const { companyName, location } = req.body;

    if (!companyName || !location) {
      return res.status(400).json({
        message: "Company name and location are required",
        success: false,
      });
    }

    let company = await Company.findOne({ name: companyName });

    if (company) {
      return res.status(400).json({
        message: "Company already exists",
        success: false,
      });
    }

    company = await Company.create({
      name: companyName,
      location,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
};

// GET ALL
export const getCompany = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.id });

    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
};

// GET BY ID
export const getcompanybyId = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
};

//  UPDATE (FINAL FIXED)
export const updateCompany = async (req, res) => {
  try {
    console.log("API HIT");

    const { name, description, website, location } = req.body;

    let logo;

    
  if (req.file) {
  try {
    const cloudResponse = await cloudinary.uploader.upload(
      req.file.path 
    );

    logo = cloudResponse.secure_url;

  } catch (err) {
    console.log("Cloudinary error:", err);
  }
}
    

    const updateData = {
      name,
      description,
      website,
      location,
      logo,
    };

    if (logo) {
      updateData.logo = logo;
    }


    const company = await Company.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company updated successfully",
      success: true,
      company,
    });

  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};