import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NOTIFICATION_API_END_POINT } from "@/Utils/constant";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearAllNotifications,
} from "@/redux/notificationSlice";
import {
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  Briefcase,
  UserCheck,
  Sparkles,
  Clock,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

// Relative time formatting helper
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "Just now";
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSec = Math.floor((now - past) / 1000);

  if (diffInSec < 60) return "Just now";
  const diffInMin = Math.floor(diffInSec / 60);
  if (diffInMin < 60) return `${diffInMin}m ago`;
  const diffInHours = Math.floor(diffInMin / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return past.toLocaleDateString();
};

const NotificationPopover = () => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount } = useSelector(
    (store) => store.notification
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Mark single as read & navigate
  const handleItemClick = async (notif) => {
    try {
      if (!notif.isRead) {
        dispatch(markNotificationAsRead(notif._id));
        await axios.put(
          `${NOTIFICATION_API_END_POINT}/${notif._id}/read`,
          {},
          { withCredentials: true }
        );
      }
      setOpen(false);
      if (notif.link) {
        navigate(notif.link);
      }
    } catch {
      // Navigate anyway
      setOpen(false);
      if (notif.link) navigate(notif.link);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      dispatch(markAllNotificationsAsRead());
      await axios.put(
        `${NOTIFICATION_API_END_POINT}/mark-all-read`,
        {},
        { withCredentials: true }
      );
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  // Delete single notification
  const handleDeleteItem = async (e, id) => {
    e.stopPropagation();
    try {
      dispatch(removeNotification(id));
      await axios.delete(`${NOTIFICATION_API_END_POINT}/${id}`, {
        withCredentials: true,
      });
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  // Clear all notifications
  const handleClearAll = async () => {
    try {
      dispatch(clearAllNotifications());
      await axios.delete(`${NOTIFICATION_API_END_POINT}/clear-all`, {
        withCredentials: true,
      });
      toast.success("All notifications cleared");
    } catch {
      toast.error("Failed to clear notifications");
    }
  };

  // Get type icon & color badge
  const getTypeBadge = (type) => {
    switch (type) {
      case "interview_scheduled":
        return {
          icon: <Calendar className="w-4 h-4 text-[#6A38C2]" />,
          bg: "bg-purple-100",
        };
      case "new_application":
        return {
          icon: <UserCheck className="w-4 h-4 text-emerald-600" />,
          bg: "bg-emerald-100",
        };
      case "application_status":
        return {
          icon: <Briefcase className="w-4 h-4 text-blue-600" />,
          bg: "bg-blue-100",
        };
      default:
        return {
          icon: <Sparkles className="w-4 h-4 text-amber-600" />,
          bg: "bg-amber-100",
        };
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative p-2 rounded-full text-gray-600 hover:text-[#6A38C2] hover:bg-purple-50 transition-colors focus:outline-none"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />

          {/* Unread Pill Badge */}
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-[#F3002F] text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-0 rounded-2xl shadow-2xl border border-gray-100 bg-white overflow-hidden text-gray-900 z-50"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50/50 p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-900 text-sm">Notifications</h4>
            {unreadCount > 0 && (
              <span className="bg-[#6A38C2] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-[#6A38C2] hover:underline font-semibold flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>

        {/* Notifications Scroll List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
          {notifications && notifications.length > 0 ? (
            notifications.map((notif) => {
              const { icon, bg } = getTypeBadge(notif.type);
              return (
                <div
                  key={notif._id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-gray-50/80 transition-colors cursor-pointer group relative ${
                    !notif.isRead ? "bg-purple-50/40" : ""
                  }`}
                >
                  {/* Type Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}
                  >
                    {icon}
                  </div>

                  {/* Body Text */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p
                        className={`text-xs font-semibold truncate ${
                          !notif.isRead ? "text-gray-900 font-bold" : "text-gray-700"
                        }`}
                      >
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6A38C2] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{formatRelativeTime(notif.createdAt)}</span>
                    </div>
                  </div>

                  {/* Delete Button on Hover */}
                  <button
                    onClick={(e) => handleDeleteItem(e, notif._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2.5 top-3 p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 px-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-[#6A38C2] flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 opacity-60" />
              </div>
              <p className="text-sm font-semibold text-gray-800">
                You're all caught up!
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                No new notifications right now.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {notifications && notifications.length > 0 && (
          <div className="p-2.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs px-4">
            <span className="text-gray-500 text-[11px]">
              {notifications.length} total notification{notifications.length > 1 ? "s" : ""}
            </span>
            <button
              onClick={handleClearAll}
              className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1 hover:underline transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Clear all
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
