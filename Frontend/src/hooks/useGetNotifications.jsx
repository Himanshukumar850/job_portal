import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NOTIFICATION_API_END_POINT } from "@/Utils/constant";
import { setNotifications } from "@/redux/notificationSlice";

const useGetNotifications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`${NOTIFICATION_API_END_POINT}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setNotifications(res.data.notifications || []));
        }
      } catch (error) {
        // Silent fail for non-blocking notifications
        console.error("Fetch Notifications Error:", error.response?.data?.message || error.message);
      }
    };

    fetchNotifications();

    // Poll periodically every 60 seconds for background updates
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [dispatch, user]);
};

export default useGetNotifications;
