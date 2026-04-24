
import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from '@/Utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

function JobDescription() {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth || {});
    
    const [isApplied, setIsApplied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [jobLoading, setJobLoading] = useState(true);
    
    const params = useParams();
    const JobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    
    const applyjobHandler = async () => {
        try {
            
            if (!user?._id) {
                toast.error("Please login to apply");
                navigate("/login");
                return;
            }
            
            
            if (isApplied) {
                toast.info("You already applied for this job");
                return;
            }
            
            setLoading(true);
            
            console.log("📤 Applying for job:", JobId);

            const res = await axios.get(
                `${APPLICATION_API_END_POINT}/apply/${JobId}`,
                { withCredentials: true }
            );


            if (res.data.success) {
                toast.success(res.data.message || "Application submitted! 🎉");
                
                
                const updatedJob = {
                    ...singleJob,
                    applications: [
                        ...singleJob.applications,
                        { applicant: { _id: user._id } }
                    ]
                };
                
                dispatch(setSingleJob(updatedJob));
                setIsApplied(true);
            }

        } catch (error) {
            console.error(" Error:", error);
            
            
            const errorMsg = 
                error.response?.data?.message || 
                error.message || 
                "Something went wrong";
            
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

   
    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                setJobLoading(true);
                
                console.log("🔄 Fetching job:", JobId);
                
                const res = await axios.get(
                    `${JOB_API_END_POINT}/get/${JobId}`,
                    { withCredentials: true }
                );

                if (res.data.success) {
                    
                    dispatch(setSingleJob(res.data.job));
                } else {
                    
                    toast.error("Failed to load job details");
                }

            } catch (error) {
                console.error(" Error fetching job:", error);
                toast.error("Failed to load job details");
            } finally {
                setJobLoading(false);
            }
        };

        if (JobId) {
            fetchSingleJob();
        }

    }, [dispatch, JobId]);

    
    useEffect(() => {
        if (singleJob && user) {
            const applied = singleJob.applications?.some(
                (app) => app?.applicant?._id === user?._id
            );
            setIsApplied(applied);
            // setIsApplied(res.data.applications.some(applications => applications.applicant === user?._id)); //ensure the state is in async with fetch data
            
            console.log("Applied status:", applied);
        }
    }, [singleJob, user]);

    
    if (jobLoading) {
        return (
            <div className="max-w-7xl mx-auto my-10">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
        );
    }

   
    if (!singleJob) {
        return (
            <div className="max-w-7xl mx-auto my-10 text-center">
                <p className="text-gray-500 text-lg">Job not found</p>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto my-10'>

            {/* Header Section */}
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>
                        {singleJob?.title || "Job Title"}
                    </h1>

                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                        <Badge className='text-blue-700 font-bold' variant="ghost">
                            {singleJob?.position || singleJob?.postion} Positions  
                        </Badge>

                        <Badge className='text-[#F83002] font-bold' variant="ghost">
                            {singleJob?.jobType}
                        </Badge>

                        <Badge className='text-[#7209b7] font-bold' variant="ghost">
                            ₹{singleJob?.salary} LPA  
                        </Badge>
                    </div>
                </div>

                
                <Button
                    onClick={applyjobHandler}
                    disabled={isApplied || loading || !user}  
                    className={`rounded-lg px-6 ${
                        isApplied
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-[#7209b7] hover:bg-[#5f32ad]'
                    }`}
                >
                    {loading ? (
                        <>
                            <span className="animate-spin mr-2">⏳</span>
                            Applying...
                        </>
                    ) : isApplied ? (
                        " Already Applied"
                    ) : (
                        "Apply Now"
                    )}
                </Button>
            </div>

            {/* Job Description Section */}
            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>
                Job Description
            </h1>

            <div className="space-y-3">
                <div className="flex">
                    <span className='font-bold min-w-[140px]'>Role:</span>
                    <span className='text-gray-800'>
                        {singleJob?.title || "N/A"}
                    </span>
                </div>

                <div className="flex">
                    <span className='font-bold min-w-[140px]'>Location:</span>
                    <span className='text-gray-800'>
                        {singleJob?.location || "N/A"}
                    </span>
                </div>

                <div className="flex flex-col">
                    <span className='font-bold'>Description:</span>
                    <span className='text-gray-800 mt-1'>
                        {singleJob?.description || "N/A"}
                    </span>
                </div>

                <div className="flex">
                    <span className='font-bold min-w-[140px]'>Experience:</span>
                    <span className='text-gray-800'>
                        {singleJob?.experienceLevel || "N/A"} years
                    </span>
                </div>

                <div className="flex">
                    <span className='font-bold min-w-[140px]'>Salary:</span>
                    <span className='text-gray-800'>
                        ₹{singleJob?.salary || "N/A"} LPA
                    </span>
                </div>

                <div className="flex">
                    <span className='font-bold min-w-[140px]'>Total Applicants:</span>
                    <span className='text-gray-800'>
                        {singleJob?.applications?.length || 0}
                    </span>
                </div>

                <div className="flex">
                    <span className='font-bold min-w-[140px]'>Posted Date:</span>
                    <span className='text-gray-800'>
                        {singleJob?.createdAt
                            ? new Date(singleJob.createdAt).toLocaleDateString('en-IN')
                            : "N/A"}
                    </span>
                </div>
            </div>

        </div>
    );
}

export default JobDescription;

