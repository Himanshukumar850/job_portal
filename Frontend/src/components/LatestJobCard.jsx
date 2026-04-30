import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";

const LatestJobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="w-full max-w-xl mx-auto 
                 p-4 sm:p-5 
                 rounded-xl 
                 shadow-md hover:shadow-xl 
                 transition duration-300 
                 bg-white border border-gray-100 
                 cursor-pointer"
    >
      
      <div className="mb-2">
        <h1 className="font-medium text-base sm:text-lg">
          {job?.company?.name}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          India
        </p>
      </div>

      
      <div>
        <h1 className="font-bold text-lg sm:text-xl my-2">
          {job?.title}
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 
                      break-words line-clamp-2">
          {job?.description}
        </p>
      </div>

      
      <div className="flex flex-wrap gap-2 mt-4 text-xs sm:text-sm">

        <Badge className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
          {job?.position}
        </Badge>

        <Badge className="text-orange-500 bg-orange-50 px-3 py-1 rounded-full font-medium">
          {job?.jobType}
        </Badge>

        <Badge className="text-purple-600 bg-purple-50 px-3 py-1 rounded-full font-medium">
          {job?.salary} LPA
        </Badge>

      </div>
    </div>
  );
};

export default LatestJobCard;