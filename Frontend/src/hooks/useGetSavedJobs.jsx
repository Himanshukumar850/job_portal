import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { JOB_API_END_POINT } from "../Utils/constant";
import { setAllSavedJobs } from "@/redux/jobSlice";

const useGetSavedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            if (!user?._id) return;
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/saved`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    dispatch(setAllSavedJobs(res.data.savedJobs));
                }
            } catch (error) {
                console.error("Fetch Saved Jobs Error:", error);
            }
        };

        fetchSavedJobs();
    }, [dispatch, user?._id]);
};

export default useGetSavedJobs;
