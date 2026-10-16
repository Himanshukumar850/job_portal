import express from "express";
import isAuthenticated, { isRecruiter } from "../middlewares/isAuthenticated.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  getSavedJobs,
  postjob,
  saveOrUnsaveJob,
  updateJob,
} from "../controllers/job.controllers.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, isRecruiter, postjob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, isRecruiter, getAdminJobs);
router.route("/saved").get(isAuthenticated, getSavedJobs);
router.route("/save/:id").post(isAuthenticated, saveOrUnsaveJob);
router.route("/get/:id").get(getJobById);
router.route("/update/:id").put(isAuthenticated, isRecruiter, updateJob);

export default router;
