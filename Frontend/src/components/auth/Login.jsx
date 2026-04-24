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

  const {loading,user} = useSelector(store=>store.auth);
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
    }finally{
        dispatch(setLoading(false))
    }
  };

  useEffect(() =>{
    if(user){
      navigate('/')
    }
  },[])

  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center max-w-7xl mx-auto">

        <form onSubmit={submitHandler} className="w-1/2 border border-gray-200 rounded-md p-4 my-10">

          <h1 className="font-bold text-xl mb-5">Login</h1>

          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeeventHandler}
              placeholder="Enter your Email"
            />
          </div>

          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeeventHandler}
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center gap-6 mt-4">

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                checked={input.role === "student"}
                onChange={changeeventHandler}
                name="role"
                value="student"
                id="student"
              />
              <Label htmlFor="student">Student</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                checked={input.role === "recruiter"}
                onChange={changeeventHandler}
                name="role"
                value="recruiter"
                id="recruiter"
              />
              <Label htmlFor="recruiter">Recruiter</Label>
            </div>

          </div>
          {
            loading ? <Button className="w-full my-4 " > <Loader2 className="mr-2 w-4 animate-spin" />Please wait </Button> : <Button type="submit" className="w-full my-4 bg-black text-white">
            Login
          </Button>
          }
          <span>
            Don't have an account{" "}
            <Link to="/signup" className="text-blue-600">
              Signup
            </Link>
          </span>

        </form>

      </div>
    </div>
  );
};

export default Login;