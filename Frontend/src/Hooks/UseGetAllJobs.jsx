

import { setAllJobs } from '@/redux/jobSlice';
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { JOB_API_END_POINT } from '@/Utils/constant'
import store from '@/redux/store';

function useGetAllJobs() {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store =>store.job);
    
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`, {
                    withCredentials: true
                });
                
                
                if (res.data.success) {
                    
                    dispatch(setAllJobs(res.data.jobs));
                } else {
                    console.warn(" Success is false");
                }
            } catch (error) {
                
                console.error("Full error:", error);
            }
        };
        
        fetchAllJobs();
        
    }, [dispatch]);  
    
    return null;  
}

export default useGetAllJobs