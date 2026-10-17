import mongoose from "mongoose";
import Application from "../models/Application.model.js";
import Job from "../models/job.model.js";
import {
  sendEmailAsync,
  generateGoogleCalendarLink,
  getInterviewEmailTemplate,
  getApplicationEmailTemplate,
  getStatusUpdateEmailTemplate,
} from "../utils/emailService.js";

// APPLY JOB
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Valid Job ID is required",
        success: false,
      });
    }

    // Role check: Only students/candidates can apply
    if (req.user?.role === "recruiter") {
      return res.status(403).json({
        message: "Recruiters are not allowed to apply for jobs",
        success: false,
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
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

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      status: "applied",
      statusHistory: [
        {
          status: "applied",
          changedAt: new Date(),
          notes: "Application submitted successfully",
        },
      ],
    });

    job.applications.push(newApplication._id);
    await job.save();

    // Trigger asynchronous confirmation email to applicant (Non-blocking)
    if (req.user?.email) {
      await job.populate("company");
      const companyName = job.company?.name || "the hiring organization";
      const portalUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/profile`;
      const emailHtml = getApplicationEmailTemplate({
        candidateName: req.user.fullname || "Applicant",
        jobTitle: job.title,
        companyName,
        portalUrl,
      });

      sendEmailAsync({
        to: req.user.email,
        subject: `Application Submitted: ${job.title} at ${companyName}`,
        html: emailHtml,
      });
    }

    return res.status(201).json({
      message: "Applied successfully",
      success: true,
      application: newApplication,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to apply for job",
      success: false,
    });
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
          path: "company",
        },
      });

    return res.status(200).json({
      applications,
      success: true,
    });
  } catch (error) {
    console.error("Get Applied Jobs Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch applied jobs",
      success: false,
    });
  }
};

// GET APPLICANTS (Recruiter - IDOR Protected)
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Valid Job ID format is required",
        success: false,
      });
    }

    const job = await Job.findById(jobId).populate({
      path: "applications",
      populate: {
        path: "applicant",
        select: "-password",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // IDOR Check: Only the recruiter who created this job can see applicants
    if (job.created_by.toString() !== req.id) {
      return res.status(403).json({
        message: "You are not authorized to view applicants for this job",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error("Get Applicants Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch applicants",
      success: false,
    });
  }
};

// UPDATE APPLICATION STATUS (IDOR Protected & Multi-Stage Pipeline)
export const updateStatus = async (req, res) => {
  try {
    const { status, interviewDate, interviewTime, meetingLink, roundName, notes } = req.body;
    const applicationId = req.params.id;

    if (!applicationId || !mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        message: "Valid Application ID is required",
        success: false,
      });
    }

    const validStatuses = [
      "pending",
      "applied",
      "under_review",
      "shortlisted",
      "interview_scheduled",
      "accepted",
      "rejected",
    ];

    const normalizedStatus = status ? status.toLowerCase().trim() : "";
    if (!normalizedStatus || !validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: `Valid status is required. Allowed values: ${validStatuses.join(", ")}`,
        success: false,
      });
    }

    const application = await Application.findById(applicationId)
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      })
      .populate({
        path: "applicant",
        select: "fullname email",
      });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    // IDOR Check: Only the recruiter who created the job can update candidate's status
    if (!application.job || application.job.created_by.toString() !== req.id) {
      return res.status(403).json({
        message: "You are not authorized to update the status of this application",
        success: false,
      });
    }

    // Validation for interview scheduling
    if (normalizedStatus === "interview_scheduled") {
      if (!interviewDate || !meetingLink) {
        return res.status(400).json({
          message: "Interview date and meeting link are required to schedule an interview",
          success: false,
        });
      }

      application.interviewDetails = {
        interviewDate: String(interviewDate).trim(),
        interviewTime: interviewTime ? String(interviewTime).trim() : "TBD",
        meetingLink: String(meetingLink).trim(),
        roundName: roundName ? String(roundName).trim() : "Technical Interview",
        notes: notes ? String(notes).trim() : "",
      };
    }

    application.status = normalizedStatus;

    if (!application.statusHistory) {
      application.statusHistory = [];
    }

    application.statusHistory.push({
      status: normalizedStatus,
      changedAt: new Date(),
      notes: notes || `Status updated to ${normalizedStatus.replace("_", " ")}`,
    });

    await application.save();

    // Trigger Smart Asynchronous Email Notifications (Non-blocking)
    if (application.applicant?.email) {
      const companyName = application.job?.company?.name || "the hiring organization";
      const candidateName = application.applicant?.fullname || "Candidate";
      const jobTitle = application.job?.title || "Job Position";
      const portalUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/profile`;

      if (normalizedStatus === "interview_scheduled") {
        const calendarUrl = generateGoogleCalendarLink({
          title: `Interview: ${jobTitle} at ${companyName}`,
          description: `Interview for ${jobTitle} at ${companyName}.\nRound: ${application.interviewDetails.roundName}\nMeeting Link: ${application.interviewDetails.meetingLink}\nNotes: ${application.interviewDetails.notes}`,
          location: application.interviewDetails.meetingLink,
          interviewDate: application.interviewDetails.interviewDate,
          interviewTime: application.interviewDetails.interviewTime,
        });

        const emailHtml = getInterviewEmailTemplate({
          candidateName,
          jobTitle,
          companyName,
          roundName: application.interviewDetails.roundName,
          interviewDate: application.interviewDetails.interviewDate,
          interviewTime: application.interviewDetails.interviewTime,
          meetingLink: application.interviewDetails.meetingLink,
          calendarUrl,
          notes: application.interviewDetails.notes,
        });

        sendEmailAsync({
          to: application.applicant.email,
          subject: `Interview Invitation: ${jobTitle} at ${companyName}`,
          html: emailHtml,
        });
      } else {
        const emailHtml = getStatusUpdateEmailTemplate({
          candidateName,
          jobTitle,
          companyName,
          status: normalizedStatus,
          notes: notes || "",
          portalUrl,
        });

        const subject =
          normalizedStatus === "accepted"
            ? `Congratulations! Job Offer for ${jobTitle} at ${companyName} 🎉`
            : normalizedStatus === "shortlisted"
            ? `Update: You've been Shortlisted for ${jobTitle} at ${companyName}`
            : `Update on your application for ${jobTitle} at ${companyName}`;

        sendEmailAsync({
          to: application.applicant.email,
          subject,
          html: emailHtml,
        });
      }
    }

    return res.status(200).json({
      message:
        normalizedStatus === "interview_scheduled"
          ? "Interview scheduled successfully"
          : `Application moved to ${normalizedStatus.replace("_", " ")}`,
      application,
      success: true,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to update application status",
      success: false,
    });
  }
};