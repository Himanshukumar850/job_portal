import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({

    applicant: {
        type: mongoose.Schema.Types.ObjectId,   
        ref: "User",
        required: true
    },

    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },


    status: {
        type: String,
        enum: [
            "pending",
            "applied",
            "under_review",
            "shortlisted",
            "interview_scheduled",
            "accepted",
            "rejected"
        ],
        default: "applied"
    },

    interviewDetails: {
        interviewDate: { type: String },
        interviewTime: { type: String },
        meetingLink: { type: String },
        roundName: { type: String, default: "Technical Round 1" },
        notes: { type: String },
    },

    statusHistory: [
        {
            status: { type: String },
            changedAt: { type: Date, default: Date.now },
            notes: { type: String },
        }
    ],

}, { timestamps: true });

const Application = mongoose.model("Application",applicationSchema)
export default Application

