import express from 'express';
import isAuthenticated, { isRecruiter } from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js'; 
import { getCompany, getcompanybyId, registerCompany, updateCompany } from '../controllers/company.controllers.js';

const router = express.Router();

router.post("/register", isAuthenticated, isRecruiter, registerCompany);
router.get("/get", isAuthenticated, isRecruiter, getCompany);
router.get("/get/:id", isAuthenticated, getcompanybyId);

router.put(
  "/update/:id",
  isAuthenticated,
  isRecruiter,
  upload.single("file"), 
  updateCompany
);

export default router;