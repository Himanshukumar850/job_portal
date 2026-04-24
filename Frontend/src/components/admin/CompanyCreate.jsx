import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { COMPANY_API_END_POINT } from "@/Utils/constant";
import { setSingleCompany } from "@/redux/CompanySlice";

function CompanyCreate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

 
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

 
  const registernewCompanies = async () => {
    try {
     
      if (!companyName || !location) {
        toast.error("All fields are required");
        return;
      }

      setLoading(true);
      console.log({
        companyName: companyName,
        location: location
      });

      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        {
          companyName: companyName,
          location: location,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message || "Company created successfully");

        const CompanyId = res?.data?.company?._id;
        navigate(`/admin/companies/${CompanyId}`);
      }

    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-4xl mx-auto">
        <div className="my-10">
          <h1 className="font-bold text-2xl">Create Your Company</h1>
          <p className="text-gray-500">
            Enter your company details. You can update them later.
          </p>
        </div>

        
        <Label>Company Name</Label>
        <Input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          type="text"
          className="my-2"
          placeholder="Enter company name"
        />

        
        <Label>Location</Label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          type="text"
          className="my-2"
          placeholder="Enter company location"
        />

        
        <div className="flex items-center gap-2 my-10">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/companies")}
          >
            Cancel
          </Button>

          <Button
            className="bg-black text-white"
            onClick={registernewCompanies}
            disabled={loading}
          >
            {loading ? "Creating..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CompanyCreate;