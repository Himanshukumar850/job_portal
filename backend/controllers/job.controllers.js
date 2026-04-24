
import Job from "../models/job.model.js";

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

    if (jobType){
      jobType = jobType.toLowerCase().replace(/\s+/g, "-").trim();
    }
    if(salary){
      salary = salary.toString().replace(/,/g, "");
    }

    salary = Number(salary);
    if (isNaN(salary)) {
      return res.status(400).json({
        message: "Salary must be a valid number",
        success: false,
      });
    }


    const userid = req.id;

    if (
      !title ||
      !description ||
      !salary ||
      !requirements ||
      !location ||
      !jobType ||
      !position ||
      !companyId ||
      !experience
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    const newjob = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userid,
    });

    return res.status(201).json({
      message: "New job created successfully.",
      newjob,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//  GET ALL JOBS (FOR USERS)
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
      .populate("company") // 🔥 MUST
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//  GET ADMIN JOBS (FOR ADMIN PANEL)
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate("company") // 🔥 MUST
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//  GET JOB BY ID
export const getJobById = async (req, res) => {
  try {
    const jobid = req.params.id;

    const job = await Job.findById(jobid).populate({
      path: "applications",
      populate: { path: "applicant" },
    });

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
    console.log(error);
  }
};

//  UPDATE JOB
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const updateData = req.body;

    const job = await Job.findByIdAndUpdate(
      jobId,
      updateData,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    return res.status(200).json({
      message: "Job updated successfully",
      job,
      success: true
    });

  } catch (error) {
    console.log(error);
  }
};