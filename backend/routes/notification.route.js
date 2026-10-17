import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../controllers/notification.controllers.js";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);
router.put("/mark-all-read", isAuthenticated, markAllAsRead);
router.put("/:id/read", isAuthenticated, markAsRead);
router.delete("/clear-all", isAuthenticated, clearAllNotifications);
router.delete("/:id", isAuthenticated, deleteNotification);

export default router;
