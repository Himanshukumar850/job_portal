import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/Browse");
    };

    return (
        <div className="text-center px-4">

            <div className="flex flex-col gap-6 my-12">

                {/* Tagline */}
                <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium text-sm sm:text-base">
                    No.1 Job Hunt Website
                </span>

                {/* Heading */}
                <h1 className="font-bold leading-tight text-3xl sm:text-4xl md:text-5xl">
                    Search, Apply & <br className="hidden sm:block" />
                    Get Your <span className="text-[#6A38C2]">Dream Jobs</span>
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base max-w-xl mx-auto text-gray-600">
                    Discover thousands of job opportunities with all the information you need.
                    It's your future. Come find it. Manage all your job applications from start to finish.
                </p>

                {/* Search Bar */}
                <div className="flex w-full sm:w-[70%] md:w-[50%] lg:w-[40%] shadow-md border border-gray-200 rounded-full items-center mx-auto overflow-hidden">

                    <Input
                        type="text"
                        placeholder="Find your dream jobs"
                        onChange={(e) => setQuery(e.target.value)}
                        className="outline-none border-none flex-1 px-4"
                    />

                    <Button
                        onClick={searchJobHandler}
                        className="bg-[#6A38C2] text-white px-6 rounded-none rounded-r-full"
                    >
                        Search
                    </Button>

                </div>

            </div>

        </div>
    );
};

export default HeroSection;