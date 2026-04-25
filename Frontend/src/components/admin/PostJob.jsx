
import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../ui/select'
import UseGetAllCompanies from '@/hooks/useGetAllCompanies'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/Utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

function PostJob() {
    UseGetAllCompanies();

    const [input, setInput] = useState({
        title: '',
        description: '',
        location: '',
        salary: '',
        companyId: '',
        requirements: '',
        position: 0,
        jobType: "",
        experience: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { companies } = useSelector(store => store.company);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    
    const selectChangeHandler = (value) => {
        setInput({ ...input, companyId: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(input);

        try {
            setLoading(true);
            console.log(JOB_API_END_POINT);


            const res = await axios.post(
                `${JOB_API_END_POINT}/post`,
                input,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials:true
                }
            );
            console.log(res);
            

            if (res?.data?.success) {
                toast.success(res.data.message || "Job created");
                navigate('/admin/jobs');
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            console.log("Finally block reached");
            
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />

            <div className='flex items-center justify-center w-screen my-10'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl w-full border border-gray-200 shadow-lg rounded-xl'>

                    <div className='grid grid-cols-2 gap-4'>

                        <div>
                            <Label>Title</Label>
                            <Input name="title" value={input.title} onChange={changeEventHandler} className='my-1' />
                        </div>

                        <div>
                            <Label>Description</Label>
                            <Input name="description" value={input.description} onChange={changeEventHandler} className='my-1' />
                        </div>

                        <div>
                            <Label>Location</Label>
                            <Input name="location" value={input.location} onChange={changeEventHandler} className='my-1' />
                        </div>

                        <div>
                            <Label>Salary</Label>
                            <Input name="salary" value={input.salary} onChange={changeEventHandler} className='my-1' />
                        </div>

                        <div>
                            <Label>Requirements</Label>
                            <Input name="requirements" value={input.requirements} onChange={changeEventHandler} className='my-1' />
                        </div>

                        <div>
                            <Label>Job Type</Label>
                            <Input name="jobType" value={input.jobType} onChange={changeEventHandler} className='my-1' />
                        </div>

                        <div>
                            <Label>Experience Level</Label>
                            <Input name="experience" value={input.experience} onChange={changeEventHandler} className='my-1' />
                        </div>

                        <div>
                            <Label>No. of Positions</Label>
                            <Input type='number' name="position" value={input.position} onChange={changeEventHandler} className='my-1' />
                        </div>

                       
                        <div className="col-span-2">
                            <Label className="mb-1 block">Select Company</Label>

                            {
                                companies.length > 0 ? (
                                    <Select onValueChange={selectChangeHandler}>
                                        <SelectTrigger className="w-full h-11">
                                            <SelectValue placeholder="Select Company" />
                                        </SelectTrigger>

                                        <SelectContent className="max-h-60 overflow-y-auto">
                                            <SelectGroup>
                                                {
                                                    companies.map((company) => (
                                                        <SelectItem key={company._id} value={company._id}>
                                                            {company.name}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className='text-gray-500'>No companies found</p>
                                )
                            }
                        </div>

                    </div>

                    
                    <Button
                        type="submit"
                        disabled={loading}
                        className='w-full mt-6 bg-black text-white'
                    >
                        {
                            loading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please wait...
                                </>
                            ) : (
                                "Post New Job"
                            )
                        }
                    </Button>

                    {
                        companies.length === 0 && (
                            <p className='text-center text-gray-500 mt-5'>
                                *Please register a company first, before posting a job
                            </p>
                        )
                    }

                </form>
            </div>
        </div>
    );
}

export default PostJob;