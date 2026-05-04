import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Home, Briefcase, Search, LogOut, User2 } from 'lucide-react'
import { motion } from "framer-motion"
import axios from 'axios'
import { USER_API_END_POINT } from '@/Utils/constant'
import { toast } from 'sonner'
import { setUser } from '@/redux/authslice'

const Navbar = () => {
  const { user } = useSelector(store => store.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname.startsWith(path)

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true
      })
      if (res.data.success) {
        dispatch(setUser(null))
        navigate("/")
        toast.success(res.data.message)
      }
    } catch {
      toast.error("Logout failed")
    }
  }

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/jobs", label: "Jobs", icon: Briefcase },
    { path: "/browse", label: "Browse", icon: Search },
  ]

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">

          {/* Logo */}
          <h1 className="text-xl sm:text-2xl font-bold">
            Job <span className="text-[#F3002F]">Portal</span>
          </h1>

          {/* Desktop Nav */}
          <ul className="hidden md:flex gap-8 relative font-medium">

            {navItems.map((item, i) => (
              <li key={i} className="relative">
                <Link
                  to={item.path}
                  className={`pb-1 ${
                    isActive(item.path)
                      ? "text-[#6A38C2]"
                      : "text-gray-700"
                  }`}
                >
                  {item.label}
                </Link>

                {/* Animated Underline */}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#6A38C2]"
                  />
                )}
              </li>
            ))}

          </ul>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {!user ? (
              <div className="hidden md:flex gap-2">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#6A38C2] text-white">SignUp</Button>
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

                    {user?.role === 'student' && (
                      <Link to="/profile" className="flex items-center gap-2">
                        <User2 size={18} />
                        View Profile
                      </Link>
                    )}

                    <div
                      onClick={logoutHandler}
                      className="flex items-center gap-2 text-red-500 cursor-pointer"
                    >
                      <LogOut size={18} />
                      Logout
                    </div>

                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </header>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around py-2 z-50">

        {navItems.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div key={i} whileTap={{ scale: 0.9 }}>
              <Link
                to={item.path}
                className={`flex flex-col items-center text-xs ${
                  isActive(item.path)
                    ? "text-[#6A38C2]"
                    : "text-gray-500"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            </motion.div>
          )
        })}

      </div>
    </>
  )
}

export default Navbar