import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/Utils/constant'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSliice'
import { toast } from 'sonner'

function Applicans() {
    const params = useParams();
    const dispatch = useDispatch();
    const {applicants} = useSelector(store =>store.application)
    const [jobTitle, setJobTitle] = useState({ id: null, title: '' });
    useEffect(() =>{
        dispatch(setAllApplicants([]));

        const fetchAllApplicants = async() =>{
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`,{withCredentials:true});
                dispatch(setAllApplicants(res.data.job.applications));
                setJobTitle({ id: params.id, title: res.data.job.title || '' });

            } catch (error) {
                toast.error(error?.response?.data?.message || 'Could not load applicants');
            }
        }

        if (params.id) {
            fetchAllApplicants();
        }

    }, [params.id, dispatch])
  return (
    <div>
        <Navbar/>
        <div className='max-w-7xl mx-auto '>
            <h1 className='font-bold text-xl my-5 '>
                Applicants{jobTitle.id === params.id && jobTitle.title ? ` for ${jobTitle.title}` : ''} ({applicants?.length || 0})
            </h1>
            <ApplicantsTable/>

        </div>
    </div>
  )
}

export default Applicans