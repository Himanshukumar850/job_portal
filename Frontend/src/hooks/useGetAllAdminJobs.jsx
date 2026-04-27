  
import { setAllAdminJobs } from '@/redux/jobSlice';
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { JOB_API_END_POINT } from '@/Utils/constant'

function useGetAllAdminJobs() {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
                    withCredentials: true
                });
                
               
                if (res.data.success) {
                    
                    dispatch(setAllAdminJobs (res.data.jobs));
                } else {
                    console.warn(" Success is false");
                }
            } catch (error) {
                
                console.error("Full error:", error);
            }
        };
        
        fetchAllAdminJobs();
        
    }, [dispatch]);  
    
    return null;  
}

export default useGetAllAdminJobs