import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/Utils/constant'
import { toast } from 'sonner'
import { setUser } from '@/redux/authslice'

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(store => store.auth)
    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.message || "Logout failed");


        }
    }
    return (
        <div className='bg-white w-full border-b'>

            <div className='w-full max-w-7xl mx-auto px-4 flex items-center justify-between h-16'>

                
                <h1 className='text-xl sm:text-2xl font-bold'>
                    Job <span className='text-[#F3002F]'>Portal</span>
                </h1>

                
                <div className='flex items-center gap-4 sm:gap-8'>

                    
                    <ul className='hidden md:flex font-medium items-center gap-5 text-sm sm:text-base'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies">Companies</Link></li>
                                    <li><Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/jobs">Jobs</Link></li>
                                    <li><Link to="/browse">Browse</Link></li>
                                </>
                            )
                        }
                    </ul>

                    
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login">
                                    <Button variant='outline'>Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                                        SignUp
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </PopoverTrigger>

                                <PopoverContent className="w-72">
                                    <div className='space-y-3'>

                                        <div className='flex items-center gap-3'>
                                            <Avatar>
                                                <AvatarImage src={user?.profile?.profilePicture} />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <h4 className='font-medium'>{user?.fullname}</h4>
                                                <p className='text-sm text-gray-500'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>

                                        {
                                            user?.role === 'student' && (
                                                <div className='flex items-center gap-2 cursor-pointer'>
                                                    <User2 size={18} />
                                                    <Link to="/profile" className="text-sm">View Profile</Link>
                                                </div>
                                            )
                                        }

                                        <div
                                            onClick={logoutHandler}
                                            className='flex items-center gap-2 cursor-pointer text-red-500'
                                        >
                                            <LogOut size={18} />
                                            <span className="text-sm">Logout</span>
                                        </div>

                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }

                </div>
            </div>
        </div>
    )
}

export default Navbar
