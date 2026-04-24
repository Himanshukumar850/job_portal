
import { useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const category = [
  "Frontend Developer",
  "Backend Developer",
  "FullStack Developer",
  "Data science",
  "Graphic Designer",
  "Mobile Developer"
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/Browse")

  }

  return (
    <div className="flex items-center justify-center gap-4 my-10 flex-wrap">


      {
        category.map((item, index) => (
          <Button
            key={index}

            onClick= {() => searchJobHandler(item)}
            variant="outline"
            className="rounded-full hover:bg-[#6A38C2] hover:text-white"
          >
            {item}
          </Button>
        ))
      }

    </div>
  );
};

export default CategoryCarousel;