import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/CompanySlice'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/Hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'

function AdminJobs() {
  useGetAllAdminJobs();
    const [input, setInput] = useState('');
    const dispatch = useDispatch();
    
    const navigate = useNavigate();
    useEffect(() =>{
        dispatch(setSearchJobByText(input));
    },[input]);
    return (
        <div>
            <Navbar />
            <div className='  max-w-6xl mx-auto my-10'>
                <div className=' flex items-center justify-between mt-5'>
                    <Input className="w-fit" placeholder="Filter by name " onChange={(e) => setInput(e.target.value)} />
                    <Button onClick={() => navigate('/admin/jobs/create')} className='bg-black text-white'  >Post new Jobs </Button>
                </div>
                <AdminJobsTable/>

            </div>

        </div>
    )
}

export default AdminJobs