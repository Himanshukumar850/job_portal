import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User2, Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/Utils/constant'
import { toast } from 'sonner'
import { setUser } from '@/redux/authslice'

const Navbar = () => {
  const [open, setOpen] = useState(false)

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
      toast.error("Logout failed");
    }
  }

  return (
    <header className="w-full bg-white border-b sticky top-0 z-50">

      {/* FULL WIDTH NAVBAR */}
      <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <h1 className="text-xl sm:text-2xl font-bold">
          Job <span className="text-[#F3002F]">Portal</span>
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6 font-medium">
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

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Desktop Auth */}
          {!user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] text-white">
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
                <div className="space-y-3">

                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user?.profile?.profilePicture} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user?.fullname}</h4>
                      <p className="text-sm text-gray-500">
                        {user?.profile?.bio}
                      </p>
                    </div>
                  </div>

                  {
                    user?.role === 'student' && (
                      <Link to="/profile" className="flex items-center gap-2">
                        <User2 size={18} />
                        View Profile
                      </Link>
                    )
                  }

                  <div
                    onClick={logoutHandler}
                    className="flex items-center gap-2 cursor-pointer text-red-500"
                  >
                    <LogOut size={18} />
                    Logout
                  </div>

                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Mobile Button */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden w-full bg-white border-t px-4 py-4 space-y-4">

          {
            user && user.role === 'recruiter' ? (
              <>
                <Link to="/admin/companies" onClick={() => setOpen(false)}>Companies</Link>
                <Link to="/admin/jobs" onClick={() => setOpen(false)}>Jobs</Link>
              </>
            ) : (
              <>
                <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                <Link to="/jobs" onClick={() => setOpen(false)}>Jobs</Link>
                <Link to="/browse" onClick={() => setOpen(false)}>Browse</Link>
              </>
            )
          }

          {!user && (
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setOpen(false)}>
                <Button className="bg-[#6A38C2] text-white w-full">
                  SignUp
                </Button>
              </Link>
            </div>
          )}

        </div>
      )}

    </header>
  )
}

export default Navbar