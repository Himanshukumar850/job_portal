

import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Job = ({ job }) => {
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);
    
    if (!job?._id) return <div className="p-5 text-gray-500">Job data unavailable</div>;
    
    const getTimeAgo = (date) => {
        if (!date) return "Recently";
        const days = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days} days ago`;
    };
    
    return (
        <div className="p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 bg-white">

           
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-400">
                    {getTimeAgo(job.createdAt)}
                </span>
                <button
                    onClick={() => setIsSaved(!isSaved)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    {isSaved ? (
                        <BookmarkCheck className="w-5 h-5 text-[#6A38C2]" />
                    ) : (
                        <Bookmark className="w-5 h-5 text-gray-600" />
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
                    onClick={() => setIsSaved(!isSaved)}
                    className="flex-1"
                >
                    {isSaved ? "Saved" : "Save"}
                </Button>
            </div>
        </div>
    );
};

export default Job;