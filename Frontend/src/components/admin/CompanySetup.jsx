
import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { COMPANY_API_END_POINT } from "@/Utils/constant";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyByid";

function CompanySetup() {
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();


  useGetCompanyById(params.id);


  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany?.name || "",
        description: singleCompany?.description || "",
        website: singleCompany?.website || "",
        location: singleCompany?.location || "",
        file: null,
      });
    }
  }, [singleCompany]);

  
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };


  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];

    setInput({ ...input, file });
  };


  const submitHandler = async (e) => {

    e.preventDefault();

    if (!input.name || !input.location) {
      toast.error("Name and location are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);

    
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(res);


      if (res.data.success) {
        toast.success(res.data.message || "Updated successfully");
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

 
  if (!singleCompany) {
    return (
      <div>
        <Navbar />
        <h2 className="text-center mt-10 text-lg font-semibold">
          Loading company data...
        </h2>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="max-w-xl mx-auto my-10">
        <form onSubmit={submitHandler}>

          {/* Header */}
          <div className="flex items-center gap-6 p-5">
            <Button
              type="button"
              onClick={() => navigate("/admin/companies")}
              variant="outline"
              className="flex items-center gap-2 text-gray-500 font-semibold"
            >
              <ArrowLeft />
              <span>Back</span>
            </Button>

            <h1 className="font-bold text-xl">Company Setup</h1>
          </div>

          {/* Form */}
          <div className="grid grid-cols-2 gap-4">

            <Label>Company Name</Label>
            <Input
              name="name"
              value={input.name}
              onChange={changeEventHandler}
              type="text"
            />

            <Label>Description</Label>
            <Input
              name="description"
              value={input.description}
              onChange={changeEventHandler}
              type="text"
            />

            <Label>Website</Label>
            <Input
              name="website"
              value={input.website}
              onChange={changeEventHandler}
              type="text"
            />

            <Label>Location</Label>
            <Input
              name="location"
              value={input.location}
              onChange={changeEventHandler}
              type="text"
            />

            <Label>Logo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={changeFileHandler}
            />
          </div>

          {/* Button */}
          <div>
            {loading ? (
              <Button className="w-full my-4">
                <Loader2 className="mr-2 w-4 animate-spin" />
                Please wait...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full my-4 bg-black text-white"
              >
                Update
              </Button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}

export default CompanySetup;