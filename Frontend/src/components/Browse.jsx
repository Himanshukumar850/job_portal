import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import store from '@/redux/store';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

import { motion, AnimatePresence } from "framer-motion";

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));

        }
    }, [])

    return (
        <div >
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold'>Search Result ({allJobs.length})</h1>
                < div className='grid grid-cols-3 gap-3'>
                    {
                        <AnimatePresence>
                            {allJobs.map((job, index) => (
                                <motion.div
                                    key={job._id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <Job job={job} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    }

                </div>

            </div>

        </div>

    )
}

export default Browse