
import React, { useMemo } from "react";
import Navbar from "./shared/Navbar";
import Filter from "./Filter";
import Job from "./Job";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const MotionDiv = motion.div;

const Jobs = () => {
    const { allJobs = [], searchedQuery = "" } = useSelector((store) => store?.job || {});
    const { user } = useSelector((store) => store.auth);

    const filteredJobs = useMemo(() => {
        if (!searchedQuery) return allJobs;

        const query = searchedQuery.toLowerCase();

        return allJobs.filter((job) => {
            return (
                job.title?.toLowerCase().includes(query) ||
                job.description?.toLowerCase().includes(query) ||
                job.location?.toLowerCase().includes(query) ||
                job.salary?.toString().toLowerCase().includes(query)
            );
        });
    }, [allJobs, searchedQuery]);

    if (user?.role === "recruiter") {
        return <Navigate to="/admin/jobs" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto mt-5 px-4">
                <div className="flex gap-5">
                    <div className="w-1/5 hidden md:block">
                        <Filter />
                    </div>

                    <div className="flex-1">
                        {filteredJobs.length <= 0 ? (
                            <div className="flex items-center justify-center h-[88vh]">
                                <div className="text-center">
                                    <p className="text-gray-500 text-lg">No Job Found</p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        Try adjusting your filters
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[88vh] overflow-y-auto pr-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredJobs.map((job) => (
                                        <MotionDiv
                                        initial={{opacity:0,x:100}}
                                        animate={{opacity:1,x:0}}
                                        exit={{opacity:0, x:-100}}
                                        transition={{duration:0.3}}
                                        key={job._id}>
                                            <Job job={job} />
                                        </MotionDiv>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
