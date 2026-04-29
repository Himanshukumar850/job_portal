import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarImage } from './ui/avatar'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'


const isResume = true;
function Profile() {
    useGetAppliedJobs();
    const [open, setopen] = useState(false);
    const { user } = useSelector((state) => state.auth);

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl bg-white border border-gray-200 rounded-2xl mx-auto my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4 '>
                        <Avatar className="h-20 w-20">
                            {user?.profile?.profilePicture ? (
                                <AvatarImage
                                    src={user.profile.profilePicture}
                                    alt="profile"
                                    className="object-cover"
                                />
                            ) : (
                                <div className=" w-full h-full flex items-center justify-center bg-gray-300 text-lg font-bold rounded-full ">
                                    {user?.fullname?.charAt(0)}
                                </div>
                            )}
                        </Avatar>

                        <div>
                            <h1 className='font-medium text-xl'> {user?.fullname}</h1>
                            <p>{user?.profile?.bio}  </p>
                        </div>
                    </div>
                    <Button onClick={() => setopen(true)} className="text-right" variant='outline'><Pen /></Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center my-2 gap-3'>
                        <Mail />
                        <span> {user?.email} </span>
                    </div>

                    <div className='flex items-center gap-3'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1 className='font-bold'>Skills</h1>
                    <div className='flex items-center gap-1'>
                        {
                            user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => <Badge key={index} >{item} </Badge>) : <span>NA </span>
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        isResume ? <a href={user?.profile?.resume} rel='noopener noreferrer' className='text-blue-500 w-full hover:underline cursor-pointer ' target='_blank'> {user?.profile?.resumeOrignalName} </a> : <span>NA</span>
                        // {user?.profile?.resumeOriginalName}
                    }
                </div>
                <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                    <h1 className='font-bold text-lg my-5'> Applied Jobs</h1>
                    {/* Application table */}
                    <AppliedJobTable />
                </div>
            </div>
            <UpdateProfileDialog open={open} setopen={setopen} />
        </div>
    )
}

export default Profile