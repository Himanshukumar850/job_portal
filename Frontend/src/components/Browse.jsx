import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Navigate } from 'react-router-dom';

import { AnimatePresence, motion } from "framer-motion";

const MotionDiv = motion.div;

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector((store) => store.job);
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [dispatch])

    if (user?.role === "recruiter") {
        return <Navigate to="/admin/jobs" replace />;
    }

    return (
        <div >
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <h1 className='font-bold mb-4'>Search Result ({allJobs.length})</h1>
                <div className='grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3  px-4 gap-4'>
                    {
                        <AnimatePresence>
                            {allJobs.map((job, index) => (
                                <MotionDiv
                                    key={job._id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <Job job={job} />
                                </MotionDiv>
                            ))}
                        </AnimatePresence>
                    }

                </div>

            </div>

        </div>

    )
}

export default Browse