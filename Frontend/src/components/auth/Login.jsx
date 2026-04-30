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
import { setLoading, setUser } from "@/redux/authslice";
import { Loader, Loader2 } from "lucide-react";

const Login = () => {

  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { loading, user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeeventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true))

      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        input,
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false))
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [])

  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">

        <form
          onSubmit={submitHandler}
          className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6"
        >

          <h1 className="font-bold text-2xl text-center mb-6">Login</h1>

          {/* Email */}
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeeventHandler}
              placeholder="Enter your Email"
              className="mt-1 focus:ring-2 focus:ring-[#6A38C2]"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeeventHandler}
              placeholder="Enter your password"
              className="mt-1 focus:ring-2 focus:ring-[#6A38C2]"
            />
          </div>

          {/* Role */}
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={input.role === "student"}
                onChange={changeeventHandler}
                name="role"
                value="student"
              />
              Student
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={input.role === "recruiter"}
                onChange={changeeventHandler}
                name="role"
                value="recruiter"
              />
              Recruiter
            </label>
          </div>

          {/* Button */}
          {loading ? (
            <Button className="w-full my-4 bg-[#6A38C2]">
              <Loader2 className="mr-2 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full my-4 bg-[#6A38C2] hover:opacity-90"
            >
              Login
            </Button>
          )}

          {/* Signup */}
          <p className="text-center text-sm mt-2">
            Don't have an account{" "}
            <Link to="/signup" className="text-[#6A38C2] font-medium">
              Signup
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
};

export default Login;