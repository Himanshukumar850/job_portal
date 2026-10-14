import { setSearchedQuery } from "@/redux/jobSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const filterData = [
  {
    title: "Location",
    options: ["Delhi", "Bangalore", "Mumbai", "Remote"]
  },
  {
    title: "Industry",
    options: ["Frontend Developer", "Backend Developer", "Full Stack"]
  },
  {
    title: "Salary",
    options: ["0-40k", "40k-1L", "1L+"]
  }
];

const FilterCard = () => {
  const [selectedValues, setSelectedValues] = useState({
    Location: "",
    Industry: "",
    Salary: ""
  });
  const dispatch = useDispatch();

  const handleChange = (title, value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [title]: value
    }));
  };

  useEffect(() => {
    const activeFilters = Object.values(selectedValues).filter(Boolean);
    const query = activeFilters.length > 0 ? activeFilters.join(" ") : "";
    dispatch(setSearchedQuery(query));
  }, [selectedValues, dispatch]);

  return (
    <div className="w-full p-4 border rounded-xl shadow-md bg-white sticky top-20 h-fit">
      <h1 className="font-bold text-lg mb-4">Filter Jobs</h1>

      {filterData.map((data, index) => (
        <div key={index} className="mb-4">
          <h2 className="font-semibold mb-2">{data.title}</h2>

          {data.options.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2 mb-1">
              <input
                type="radio"
                name={data.title}
                value={item}
                checked={selectedValues[data.title] === item}
                onChange={() => handleChange(data.title, item)}
                className="cursor-pointer"
                id={`${data.title}-${idx}`}
              />

              <label htmlFor={`${data.title}-${idx}`} className="cursor-pointer">
                {item}
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FilterCard;