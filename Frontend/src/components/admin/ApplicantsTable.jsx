import React, { useState } from 'react'
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
import { MoreHorizontal, Calendar, CheckCircle2, XCircle, Clock, Eye, Video } from 'lucide-react'
import { Badge } from '../ui/badge'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/Utils/constant'
import { setApplicantStatus } from '@/redux/applicationSliice'
import ScheduleInterviewDialog from './ScheduleInterviewDialog'

const statusOptions = [
    { label: "Move to In Review", value: "under_review", icon: Eye, color: "text-blue-600 hover:bg-blue-50" },
    { label: "Shortlist Candidate", value: "shortlisted", icon: CheckCircle2, color: "text-purple-600 hover:bg-purple-50" },
    { label: "Schedule Interview", value: "interview_scheduled", icon: Calendar, color: "text-indigo-600 hover:bg-indigo-50" },
    { label: "Hire Candidate", value: "accepted", icon: CheckCircle2, color: "text-emerald-600 hover:bg-emerald-50" },
    { label: "Reject Candidate", value: "rejected", icon: XCircle, color: "text-rose-600 hover:bg-rose-50" }
];

function ApplicantsTable() {
    const { applicants } = useSelector(store => store.application);
    const dispatch = useDispatch();

    const [interviewDialogOpen, setInterviewDialogOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const statusHandler = async (statusValue, id) => {
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status: statusValue }, {
                withCredentials: true 
            });
            if (res.data.success) {
                dispatch(setApplicantStatus({
                    applicationId: id,
                    status: statusValue.toLowerCase(),
                }));
                toast.success(res.data.message || "Status updated successfully");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Request failed");
        }
    }

    const openInterviewScheduler = (applicantItem) => {
        setSelectedApplicant(applicantItem);
        setInterviewDialogOpen(true);
    };

    const renderStatusBadge = (status, interviewDetails) => {
        const s = (status || "applied").toLowerCase();

        switch (s) {
            case "under_review":
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">In Review</Badge>;
            case "shortlisted":
                return <Badge className="bg-purple-100 text-[#6A38C2] hover:bg-purple-100 border-none font-semibold">Shortlisted</Badge>;
            case "interview_scheduled":
                return (
                    <div className="flex flex-col gap-0.5">
                        <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none font-semibold flex items-center gap-1 w-fit">
                            <Calendar className="w-3 h-3" />
                            <span>Interview Scheduled</span>
                        </Badge>
                        {interviewDetails?.interviewDate && (
                            <span className="text-[11px] text-gray-500">
                                {interviewDetails.interviewDate} {interviewDetails.interviewTime ? `• ${interviewDetails.interviewTime}` : ''}
                            </span>
                        )}
                    </div>
                );
            case "accepted":
                return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-semibold">Hired / Selected</Badge>;
            case "rejected":
                return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none font-semibold">Rejected</Badge>;
            case "pending":
            case "applied":
            default:
                return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Applied</Badge>;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Table>
                <TableCaption className="pb-4">A complete list of applicants for this position</TableCaption>

                {/* Header */}
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="font-semibold text-gray-700">Full Name</TableHead>
                        <TableHead className="font-semibold text-gray-700">Email</TableHead>
                        <TableHead className="font-semibold text-gray-700">Contact</TableHead>
                        <TableHead className="font-semibold text-gray-700">Resume</TableHead>
                        <TableHead className="font-semibold text-gray-700">Applied Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">Pipeline Stage</TableHead>
                        <TableHead className='text-right font-semibold text-gray-700'>Action</TableHead>
                    </TableRow>
                </TableHeader>

                {/* Body */}
                <TableBody>
                    {
                        applicants?.length > 0 ? (
                            applicants.map((item) => (
                                <TableRow key={item?._id} className="hover:bg-gray-50/70 transition-colors">

                                    <TableCell className="font-medium text-gray-900">{item?.applicant?.fullname || "N/A"}</TableCell>
                                    <TableCell className="text-gray-600">{item?.applicant?.email || "N/A"}</TableCell>
                                    <TableCell className="text-gray-600">{item?.applicant?.phoneNumber || "N/A"}</TableCell>
                                    <TableCell>
                                        {
                                            item?.applicant?.profile?.resume ? (
                                                <a 
                                                    className='text-[#6A38C2] hover:underline font-medium text-xs flex items-center gap-1' 
                                                    href={item?.applicant?.profile?.resume} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    {item?.applicant?.profile?.resumeOrignalName || "View Resume"}
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-xs">No Resume Uploaded</span>
                                            )
                                        }
                                    </TableCell>

                                    <TableCell className="text-gray-500 text-xs">{item?.createdAt?.split("T")[0]}</TableCell>
                                    
                                    <TableCell>
                                        {renderStatusBadge(item?.status, item?.interviewDetails)}
                                    </TableCell>

                                    <TableCell className='text-right'>
                                        <div className="flex items-center justify-end gap-1">
                                            {item?.interviewDetails?.meetingLink && (
                                                <a
                                                    href={item.interviewDetails.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Open Meeting Link"
                                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                                >
                                                    <Video className="w-4 h-4" />
                                                </a>
                                            )}

                                            <Popover.Root>
                                                <Popover.Trigger asChild>
                                                    <button 
                                                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
                                                        title="Change Pipeline Status"
                                                    >
                                                        <MoreHorizontal className="w-5 h-5" />
                                                    </button>
                                                </Popover.Trigger>

                                                <Popover.Content 
                                                    className='w-56 bg-white shadow-xl rounded-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95'
                                                    sideOffset={5}
                                                    align="end"
                                                >
                                                    <p className="text-[11px] font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">
                                                        Change Stage
                                                    </p>
                                                    {
                                                        statusOptions.map((option, i) => {
                                                            const Icon = option.icon;
                                                            return (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => {
                                                                        if (option.value === "interview_scheduled") {
                                                                            openInterviewScheduler(item);
                                                                        } else {
                                                                            statusHandler(option.value, item?._id);
                                                                        }
                                                                    }}
                                                                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-colors ${option.color}`}
                                                                >
                                                                    <Icon className="w-3.5 h-3.5" />
                                                                    <span>{option.label}</span>
                                                                </button>
                                                            );
                                                        })
                                                    }
                                                </Popover.Content>
                                            </Popover.Root>
                                        </div>
                                    </TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                                    No applicants found for this job position.
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>

            {/* Schedule Interview Modal */}
            <ScheduleInterviewDialog
                open={interviewDialogOpen}
                setOpen={setInterviewDialogOpen}
                applicant={selectedApplicant}
            />
        </div>
    )
}

export default ApplicantsTable
