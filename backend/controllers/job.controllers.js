
import mongoose from "mongoose";
import Job from "../models/job.model.js";
import Company from "../models/company.js";

// CREATE JOB
export const postjob = async (req, res) => {
  try {
    let {
      title,
      description,
      salary,
      requirements,
      location,
      jobType,
      position,
      companyId,
      experience,
    } = req.body;

    // RBAC: Only recruiters can post jobs
    if (req.user?.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can post jobs",
        success: false,
      });
    }

    if (
      !title ||
      !description ||
      salary === undefined ||
      salary === null ||
      salary === "" ||
      !requirements ||
      !location ||
      !jobType ||
      !position ||
      !companyId ||
      experience === undefined ||
      experience === null ||
      experience === ""
    ) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    // Salary validation
    const cleanSalary = salary.toString().replace(/,/g, "").trim();
    const parsedSalary = Number(cleanSalary);
    if (isNaN(parsedSalary) || parsedSalary < 0) {
      return res.status(400).json({
        message: "Salary must be a valid positive number",
        success: false,
      });
    }

    // Validate companyId
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        message: "Invalid Company ID",
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

    // Ownership check: Recruiter can only post for their own company
    if (company.userId.toString() !== req.id) {
      return res.status(403).json({
        message: "You can only post jobs for a company you own",
        success: false,
      });
    }

    // Requirements safe format
    const requirementsArray = Array.isArray(requirements)
      ? requirements
      : requirements.split(",").map((r) => r.trim()).filter(Boolean);

    const formattedJobType = jobType.toLowerCase().replace(/\s+/g, "-").trim();
    const experienceLevel = Number(experience);

    const userid = req.id;

    const newjob = await Job.create({
      title: title.trim(),
      description: description.trim(),
      requirements: requirementsArray,
      salary: parsedSalary,
      location: location.trim(),
      jobType: formattedJobType,
      experienceLevel: isNaN(experienceLevel) ? 0 : experienceLevel,
      position: position.trim(),
      company: companyId,
      created_by: userid,
    });

    return res.status(201).json({
      message: "New job created successfully.",
      newjob,
      success: true,
    });
  } catch (error) {
    console.error("Post Job Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to create job",
      success: false,
    });
  }
};

// GET ALL JOBS (PUBLIC / FOR USERS)
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch jobs",
      success: false,
    });
  }
};

// GET ADMIN JOBS (FOR RECRUITER DASHBOARD)
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error("Get Admin Jobs Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch recruiter jobs",
      success: false,
    });
  }
};

// GET JOB BY ID
export const getJobById = async (req, res) => {
  try {
    const jobid = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobid)) {
      return res.status(400).json({
        message: "Invalid Job ID format",
        success: false,
      });
    }

    const job = await Job.findById(jobid).populate({
      path: "applications",
      populate: { path: "applicant", select: "-password" },
    }).populate("company");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error("Get Job By Id Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch job details",
      success: false,
    });
  }
};

// UPDATE JOB (IDOR PROTECTED)
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid Job ID format",
        success: false,
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // IDOR Authorization Check: Only owner can update job
    if (job.created_by.toString() !== req.id) {
      return res.status(403).json({
        message: "You are not authorized to update this job",
        success: false,
      });
    }

    const updateData = { ...req.body };

    // Format requirements if updated
    if (updateData.requirements) {
      updateData.requirements = Array.isArray(updateData.requirements)
        ? updateData.requirements
        : updateData.requirements.split(",").map((r) => r.trim()).filter(Boolean);
    }

    // Validate salary if updated
    if (updateData.salary !== undefined) {
      const parsedSalary = Number(updateData.salary.toString().replace(/,/g, ""));
      if (isNaN(parsedSalary) || parsedSalary < 0) {
        return res.status(400).json({
          message: "Salary must be a valid positive number",
          success: false,
        });
      }
      updateData.salary = parsedSalary;
    }

    if (updateData.jobType) {
      updateData.jobType = updateData.jobType.toLowerCase().replace(/\s+/g, "-").trim();
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
      success: true,
    });
  } catch (error) {
    console.error("Update Job Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to update job",
      success: false,
    });
  }
};