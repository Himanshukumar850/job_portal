
import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../ui/table'

import * as Popover from "@radix-ui/react-popover"
import { MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/Utils/constant'

const shortlistingStatus = ["Accepted", "Rejected"]

function ApplicantsTable() {
    const { applicants } = useSelector(store => store.application);
    const statusHandler = async (status,id) =>{
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`,{status},{
                withCredentials:true 
            });
            if (res.data.success){
                toast.success(res.data.message);
            }

        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Request failed");
            
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied users</TableCaption>

                {/* Header */}
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className='text-right'>Action</TableHead>
                    </TableRow>
                </TableHeader>

                {/* Body */}
                <TableBody>
                    {
                        applicants?.length > 0 ? (
                            applicants.map((item, index) => (
                                <TableRow key={index}>

                                    <TableCell>{item?.applicant?.fullname}</TableCell>
                                    <TableCell>{item?.applicant?.email}</TableCell>
                                    <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                    <TableCell   >
                                        {
                                            item?.applicant?.profile?.resume ? <a className='text-blue-600 cursor-pointer' href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">
                                                {item?.applicant?.profile?.resumeOrignalName}
                                            </a> : "No Resume Uploaded"
                                        }

                                    </TableCell>

                                    <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>

                                    <TableCell className='text-right'>
                                        <Popover.Root>
                                            <Popover.Trigger asChild>
                                                <button>
                                                    <MoreHorizontal />
                                                </button>
                                            </Popover.Trigger>

                                            <Popover.Content className='w-32 bg-white shadow-md rounded p-2'>
                                                {
                                                    shortlistingStatus.map((status, i) => (
                                                        <div onClick={() =>statusHandler(status,item?._id)}
                                                            key={i}
                                                            className='cursor-pointer hover:bg-gray-100 p-1 rounded'
                                                        >
                                                            {status}
                                                        </div>
                                                    ))
                                                }
                                            </Popover.Content>
                                        </Popover.Root>
                                    </TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No Applicants Found
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable
