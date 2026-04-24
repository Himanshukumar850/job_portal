import Application from "../models/Application.model.js";
import Job from "../models/job.model.js";


// APPLY JOB
export const applyJob = async (req, res) => {
  try {

    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required",
        success: false
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Applied successfully",
      success: true,
      application: newApplication
    });

  } catch (error) {
    console.log(error);
  }
};



// GET APPLIED JOBS (Candidate)
export const getAppliedJobs = async (req, res) => {
  try {

    const userId = req.id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company"
        }
      });

    return res.status(200).json({
      applications,
      success: true
    });

  } catch (error) {
    console.log(error);
  }
};



// GET APPLICANTS (Recruiter)
export const getApplicants = async (req, res) => {
  try {

    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      populate: {
        path: "applicant"
      }
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    return res.status(200).json({
      job,
      success: true
    });

  } catch (error) {
    console.log(error);
  }
};



// UPDATE APPLICATION STATUS
export const updateStatus = async (req, res) => {
  try {

    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false
      });
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false
      });
    }

    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Status updated successfully",
      success: true
    });

  } catch (error) {
    console.log(error);
  }
};