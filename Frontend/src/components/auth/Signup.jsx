import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Navbar from "../shared/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "../../Utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authslice";
import { Loader2, Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });

  const [showPassword, setShowPassword] = useState(false);

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const changeFileHandler = (e) => {
    setInput({
      ...input,
      file: e.target.files[0],
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("role", input.role);

    if (input.file) {
      formData.append("profile", input.file);
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.post(
        `${USER_API_END_POINT}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">

        <form
          onSubmit={submitHandler}
          className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6"
        >
          <h1 className="text-2xl font-bold text-center mb-6">
            Signup
          </h1>

          {/* Full Name */}
          <div className="mb-4">
            <Label>Full Name</Label>
            <Input
              type="text"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              placeholder="Enter your name"
              className="mt-1 focus:ring-2 focus:ring-[#6A38C2]"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="Enter your email"
              className="mt-1 focus:ring-2 focus:ring-[#6A38C2]"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <Label>Phone Number</Label>
            <Input
              type="text"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="Enter your number"
              className="mt-1 focus:ring-2 focus:ring-[#6A38C2]"
            />
          </div>

          {/* Password with Toggle */}
          <div className="mb-4">
            <Label>Password</Label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="Enter your password"
                className="mt-1 pr-10 focus:ring-2 focus:ring-[#6A38C2]"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Role */}
          <div className="flex justify-center gap-6 mb-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="student"
                checked={input.role === "student"}
                onChange={changeEventHandler}
              />
              Student
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="recruiter"
                checked={input.role === "recruiter"}
                onChange={changeEventHandler}
              />
              Recruiter
            </label>
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <Label>Profile Photo</Label>
            <input
              type="file"
              accept="image/*"
              onChange={changeFileHandler}
              className="mt-1 w-full text-sm file:mr-4 file:py-2 file:px-4 
              file:rounded-full file:border-0 
              file:bg-[#6A38C2] file:text-white 
              hover:file:opacity-90 cursor-pointer"
            />
          </div>

          {/* Button */}
          {loading ? (
            <Button className="w-full bg-[#6A38C2]">
              <Loader2 className="mr-2 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-[#6A38C2] hover:opacity-90"
            >
              Signup
            </Button>
          )}

          {/* Login */}
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#6A38C2] font-medium">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Signup;