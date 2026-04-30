import { useSelector } from "react-redux";
import LatestJobcard from "./LatestJobCard";

const LatestJobs = () => {
    
    const allJobs = useSelector(state => state?.job?.allJobs || []);

    return (
        <div className="w-full flex justify-center px-4 my-16">

            {/* Centered Container */}
            <div className="w-full max-w-5xl">

                {/* Heading */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center sm:text-left">
                    <span className="text-[#6A38C2]">Latest & Top </span> Job Opening
                </h1>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">

                    {allJobs?.length > 0 ? (
                        allJobs.slice(0, 6).map((job) => (
                            <LatestJobcard key={job._id} job={job} />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500">
                            No Job Available
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

export default LatestJobs;