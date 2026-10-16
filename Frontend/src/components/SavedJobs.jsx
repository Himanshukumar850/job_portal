import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useSelector } from "react-redux";
import useGetSavedJobs from "@/hooks/useGetSavedJobs";
import { Bookmark, Search, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link, Navigate } from "react-router-dom";

const SavedJobs = () => {
  useGetSavedJobs();
  const { allSavedJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [searchTerm, setSearchTerm] = useState("");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const filteredJobs = (allSavedJobs || []).filter((job) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const title = job?.title?.toLowerCase() || "";
    const company = job?.company?.name?.toLowerCase() || "";
    const location = job?.location?.toLowerCase() || "";
    return title.includes(term) || company.includes(term) || location.includes(term);
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg text-[#6A38C2]">
                  <Bookmark className="w-6 h-6 fill-[#6A38C2]" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Saved Jobs
                </h1>
                <span className="text-sm font-semibold bg-purple-100 text-[#6A38C2] px-3 py-1 rounded-full">
                  {allSavedJobs?.length || 0}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Keep track of jobs you are interested in and apply when ready.
              </p>
            </div>

            {/* Quick Search inside Saved */}
            {allSavedJobs && allSavedJobs.length > 0 && (
              <div className="relative w-full sm:w-72">
                <Input
                  type="text"
                  placeholder="Search in saved jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#6A38C2]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            )}
          </div>
        </div>

        {/* Saved Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm max-w-xl mx-auto my-12">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#6A38C2]">
              <Bookmark className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {allSavedJobs?.length === 0
                ? "No saved jobs yet"
                : "No matching saved jobs found"}
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              {allSavedJobs?.length === 0
                ? "You haven't bookmarked any jobs yet. Browse available jobs and save the ones you like!"
                : "Try searching with a different job title, company name, or location."}
            </p>
            <Link to="/jobs">
              <Button className="bg-[#6A38C2] hover:bg-[#5a2fa3] text-white flex items-center gap-2 mx-auto px-6 py-2">
                <span>Browse All Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Job key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
