import express from "express";
import isAuthenticated  from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postjob,updateJob  } from "../controllers/job.controllers.js";

const router = express.Router();

router.route("/post").post(isAuthenticated,postjob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated,getAdminJobs);
router.route("/get/:id").get(isAuthenticated,getJobById);
router.route("/update/:id").put(isAuthenticated, updateJob);

export default router;
