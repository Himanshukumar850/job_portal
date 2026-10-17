import Notification from "../models/notification.model.js";

// Helper function to create notification safely (used by controllers)
export const createNotificationAsync = async ({
  recipient,
  sender,
  title,
  message,
  type = "system",
  link = "/profile",
}) => {
  try {
    if (!recipient || !title || !message) return null;

    const notification = await Notification.create({
      recipient,
      sender,
      title,
      message,
      type,
      link,
      isRead: false,
    });

    return notification;
  } catch (error) {
    console.error("Create Notification Error (Non-blocking):", error.message);
    return null;
  }
};

// 1. GET ALL NOTIFICATIONS FOR LOGGED-IN USER
export const getNotifications = async (req, res) => {
  try {
    const userId = req.id;

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(40);

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    return res.status(200).json({
      notifications,
      unreadCount,
      success: true,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch notifications",
      success: false,
    });
  }
};

// 2. MARK SINGLE NOTIFICATION AS READ
export const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
        success: false,
      });
    }

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    return res.status(200).json({
      message: "Notification marked as read",
      notification,
      unreadCount,
      success: true,
    });
  } catch (error) {
    console.error("Mark Read Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to mark notification as read",
      success: false,
    });
  }
};

// 3. MARK ALL NOTIFICATIONS AS READ
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.id;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    return res.status(200).json({
      message: "All notifications marked as read",
      unreadCount: 0,
      success: true,
    });
  } catch (error) {
    console.error("Mark All Read Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to mark all as read",
      success: false,
    });
  }
};

// 4. DELETE SINGLE NOTIFICATION
export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
        success: false,
      });
    }

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    return res.status(200).json({
      message: "Notification deleted successfully",
      unreadCount,
      success: true,
    });
  } catch (error) {
    console.error("Delete Notification Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to delete notification",
      success: false,
    });
  }
};

// 5. CLEAR ALL NOTIFICATIONS
export const clearAllNotifications = async (req, res) => {
  try {
    const userId = req.id;

    await Notification.deleteMany({ recipient: userId });

    return res.status(200).json({
      message: "All notifications cleared successfully",
      unreadCount: 0,
      success: true,
    });
  } catch (error) {
    console.error("Clear All Notifications Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to clear notifications",
      success: false,
    });
  }
};
