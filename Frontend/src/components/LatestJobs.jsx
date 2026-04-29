

import { useSelector } from "react-redux";
import LatestJobcard from "./LatestJobCard"


const LatestJobs = () => {
    
    const allJobs = useSelector(state => state?.job?.allJobs || []);
    
    return (
        <div className="max-w-7xl mx-auto my-20 px-4 ">
            <h1 className="text-4xl font-bold">
                <span className="text-[#6A38C2]">Latest & Top </span> Job Opening
            </h1>
            
           
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-5 ">
                {allJobs?.length > 0 ? (
                    allJobs.slice(0, 6).map((job) => (
                        <LatestJobcard  key={job._id} job={job} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500 ">
                        No Job Available
                    </div>
                )}
            </div>
        </div>
    )
}

export default LatestJobs