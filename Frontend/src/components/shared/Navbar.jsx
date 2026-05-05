import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Home,
  Briefcase,
  Search,
  User,
  LogOut,
  User2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { USER_API_END_POINT } from "@/Utils/constant";
import { toast } from "sonner";
import { setUser } from "@/redux/authslice";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [openSheet, setOpenSheet] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success("Logged out successfully");
        setOpenSheet(false);
      }
    } catch {
      toast.error("Logout failed");
    }
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/jobs", label: "Jobs", icon: Briefcase },
    { path: "/browse", label: "Browse", icon: Search },
  ];

  return (
    <>
      {/*  HEADER  */}
      <header className="w-full bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <h1 className="text-xl sm:text-2xl font-bold">
            Job <span className="text-[#F3002F]">Portal</span>
          </h1>

          {/* Desktop Nav */}
          <ul className="hidden md:flex gap-8 font-medium">
            {navItems.map((item, i) => (
              <li key={i}>
                <Link
                  to={item.path}
                  className={`${
                    isActive(item.path)
                      ? "text-[#6A38C2]"
                      : "text-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#6A38C2] text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.profile?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </PopoverTrigger>

                <PopoverContent className="w-64 p-4">
                  <p className="font-semibold">{user?.fullname}</p>

                  <Link to="/profile" className="block mt-3">
                    View Profile
                  </Link>

                  <button
                    onClick={logoutHandler}
                    className="mt-3 text-red-500"
                  >
                    Logout
                  </button>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </header>

      {/* ================= MOBILE NAV ================= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t flex justify-around py-2 z-50">

        {navItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link key={i} to={item.path} className="flex flex-col items-center text-xs">
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}

        {/* Profile Button */}
        <button
          onClick={() => setOpenSheet(true)}
          className="flex flex-col items-center text-xs"
        >
          <User size={20} />
          Profile
        </button>
      </div>

      {/*  MOBILE BOTTOM SHEET  */}
      <AnimatePresence>
        {openSheet && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenSheet(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              className="fixed bottom-0 left-0 w-full bg-white rounded-t-2xl p-5 z-50"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
            >
              {/* Close */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Account</h3>
                <X onClick={() => setOpenSheet(false)} />
              </div>

              {user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={user?.profile?.profilePicture} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user?.fullname}</p>
                      <p className="text-sm text-gray-500">
                        {user?.profile?.bio || "No bio"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <Link
                    to="/profile"
                    onClick={() => setOpenSheet(false)}
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100"
                  >
                    <User2 size={18} />
                    Profile
                  </Link>

                  <button
                    onClick={logoutHandler}
                    className="flex items-center gap-2 p-3 rounded-lg text-red-500 hover:bg-red-50 w-full"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="block text-center p-3">
                  Login
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;