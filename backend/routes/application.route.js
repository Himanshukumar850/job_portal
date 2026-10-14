import express from 'express';
import isAuthenticated, { isRecruiter } from '../middlewares/isAuthenticated.js';
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from '../controllers/application.controllers.js';

const router = express.Router();

// Allow both GET and POST for apply so existing frontend doesn't break while supporting standard REST POST
router.route("/apply/:id")
  .get(isAuthenticated, applyJob)
  .post(isAuthenticated, applyJob);

router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, isRecruiter, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, isRecruiter, updateStatus);

export default router;