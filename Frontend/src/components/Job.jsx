

import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { JOB_API_END_POINT } from "@/Utils/constant";
import { toast } from "sonner";
import { setUser } from "@/redux/authslice";
import { setAllSavedJobs } from "@/redux/jobSlice";

const Job = ({ job }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);
    const { allSavedJobs } = useSelector((store) => store.job);
    const [saving, setSaving] = useState(false);

    if (!job?._id) return <div className="p-5 text-gray-500">Job data unavailable</div>;

    // Check if this job is saved by logged-in user
    const isSaved = Boolean(
        user?.savedJobs?.some((savedId) => {
            const id = typeof savedId === "object" ? savedId?._id : savedId;
            return id?.toString() === job._id?.toString();
        }) ||
        allSavedJobs?.some((savedJob) => savedJob?._id?.toString() === job._id?.toString())
    );

    const toggleSaveHandler = async (e) => {
        if (e) e.stopPropagation();
        if (!user?._id) {
            toast.error("Please login to save jobs");
            navigate("/login");
            return;
        }

        try {
            setSaving(true);
            const res = await axios.post(
                `${JOB_API_END_POINT}/save/${job._id}`,
                {},
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success(res.data.message);

                dispatch(
                    setUser({
                        ...user,
                        savedJobs: res.data.savedJobs,
                    })
                );

                if (res.data.isSaved) {
                    dispatch(setAllSavedJobs([job, ...(allSavedJobs || [])]));
                } else {
                    dispatch(
                        setAllSavedJobs(
                            (allSavedJobs || []).filter(
                                (item) => item?._id?.toString() !== job._id?.toString()
                            )
                        )
                    );
                }
            }
        } catch (error) {
            console.error("Save Job Error:", error);
            toast.error(error.response?.data?.message || "Failed to update saved job");
        } finally {
            setSaving(false);
        }
    };

    const getTimeAgo = (date) => {
        if (!date) return "Recently";
        const now = new Date();
        const jobDate = new Date(date);
        const diffDays = Math.floor((now - jobDate) / (1000 * 60 * 60 * 24));
        if (Number.isNaN(diffDays)) return "Recently";
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        return `${diffDays} days ago`;
    };
    
    return (
        <div className="p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 bg-white">

            <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-400">
                    {getTimeAgo(job.createdAt)}
                </span>
                <button
                    onClick={toggleSaveHandler}
                    disabled={saving}
                    title={isSaved ? "Remove from saved" : "Save job"}
                    className="p-2 hover:bg-purple-50 rounded-full transition-colors"
                >
                    {isSaved ? (
                        <BookmarkCheck className="w-5 h-5 text-[#6A38C2] fill-[#6A38C2]" />
                    ) : (
                        <Bookmark className="w-5 h-5 text-gray-600 hover:text-[#6A38C2]" />
                    )}
                </button>
            </div>

            {/* Company Section */}
            <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12">
                    <AvatarImage 
                        src={job.company?.logo} 
                        alt={job.company?.name}
                    />
                </Avatar>
                <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-900">
                        {job.company?.name || "Company"}
                    </h3>
                    <p className="text-gray-500 text-xs">
                        {job.location || "Location not specified"}
                    </p>
                </div>
            </div>

            {/* Job Title & Description */}
            <div className="mb-4">
                <h2 className="font-bold text-lg text-gray-900 mb-2">
                    {job.title || "Job Title"}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                    {job.description || "No description"}
                </p>
            </div>

            
            <div className="flex flex-wrap gap-2 mb-4">
                {job.position && (
                    <Badge variant="secondary" className="text-blue-700 font-medium">
                        {job.position}
                    </Badge>
                )}
                {job.jobType && (
                    <Badge variant="secondary" className="text-[#F83002] font-medium">
                        {job.jobType}
                    </Badge>
                )}
                {job.salary && (
                    <Badge variant="secondary" className="text-[#7209b7] font-medium">
                        ₹{job.salary.toLocaleString()} LPA
                    </Badge>
                )}
            </div>

            
            <div className="flex gap-2">
                <Button
                    onClick={() => navigate(`/description/${job._id}`)}
                    className="flex-1 bg-[#6A38C2] hover:bg-[#5a2fa3] text-white"
                >
                    View Details
                </Button>
                <Button
                    variant="outline"
                    onClick={toggleSaveHandler}
                    disabled={saving}
                    className={`flex-1 transition-all ${
                        isSaved
                            ? "border-[#6A38C2] text-[#6A38C2] bg-purple-50 hover:bg-purple-100"
                            : "hover:border-[#6A38C2] hover:text-[#6A38C2]"
                    }`}
                >
                    {isSaved ? "Saved" : "Save For Later"}
                </Button>
            </div>
        </div>
    );
};

export default Job;