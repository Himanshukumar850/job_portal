import express from 'express';
import {
  login,
  logout,
  register,
  updateProfile,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from '../controllers/user.Controllers.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post("/register", upload.single("profile"), register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/profile/update", isAuthenticated, upload.single("profile"), updateProfile);

// Password Reset via Email OTP
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

export default router;