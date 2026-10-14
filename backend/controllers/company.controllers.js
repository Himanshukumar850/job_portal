

import fs from "fs";
import mongoose from "mongoose";
import Company from "../models/company.js";
import cloudinary from "../utils/Cloudinary.js";

// REGISTER COMPANY
export const registerCompany = async (req, res) => {
  try {
    const { companyName, location } = req.body;

    // RBAC: Only recruiters can register companies
    if (req.user?.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can register a company",
        success: false,
      });
    }

    if (!companyName || !companyName.trim() || !location || !location.trim()) {
      return res.status(400).json({
        message: "Company name and location are required",
        success: false,
      });
    }

    let company = await Company.findOne({ name: companyName.trim() });

    if (company) {
      return res.status(400).json({
        message: "Company already exists with this name",
        success: false,
      });
    }

    company = await Company.create({
      name: companyName.trim(),
      location: location.trim(),
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.error("Register Company Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to register company",
      success: false,
    });
  }
};

// GET ALL COMPANIES (Logged in Recruiter)
export const getCompany = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      companies: companies || [],
      success: true,
    });
  } catch (error) {
    console.error("Get Company Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch companies",
      success: false,
    });
  }
};

// GET COMPANY BY ID
export const getcompanybyId = async (req, res) => {
  try {
    const companyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        message: "Invalid Company ID format",
        success: false,
      });
    }

    const company = await Company.findById(companyId);

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
    console.error("Get Company By Id Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch company",
      success: false,
    });
  }
};

// UPDATE COMPANY (IDOR PROTECTED & SAFE FILE CLEANUP)
export const updateCompany = async (req, res) => {
  const uploadedFilePath = req.file ? req.file.path : null;
  try {
    const companyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        message: "Invalid Company ID format",
        success: false,
      });
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    // IDOR Check: Ensure only the creator/owner recruiter can edit this company
    if (company.userId.toString() !== req.id) {
      return res.status(403).json({
        message: "You are not authorized to update this company",
        success: false,
      });
    }

    const { name, description, website, location } = req.body;

    // Handle logo upload
    if (req.file) {
      const cloudResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: "company_logos",
      });
      company.logo = cloudResponse.secure_url;
    }

    // Only update fields provided
    if (name && name.trim()) company.name = name.trim();
    if (description !== undefined) company.description = description;
    if (website !== undefined) company.website = website;
    if (location && location.trim()) company.location = location.trim();

    await company.save();

    return res.status(200).json({
      message: "Company updated successfully",
      success: true,
      company,
    });
  } catch (error) {
    console.error("Update Company Error:", error);
    return res.status(500).json({
      message: error.message || "Server error while updating company",
      success: false,
    });
  } finally {
    // Always clean up local uploaded file from disk
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath);
      } catch (unlinkErr) {
        console.error("File cleanup error in updateCompany:", unlinkErr);
      }
    }
  }
};