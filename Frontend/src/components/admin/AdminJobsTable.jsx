
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../ui/table";

import { Avatar, AvatarImage } from "../ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { MoreHorizontal, Edit2, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchJobByText } from "@/redux/jobSlice";

function AdminJobsTable() {
  const navigate = useNavigate();

  const { allAdminJobs = [], searchJobByText = "" } = useSelector(
    (store) => store.job
  );
  console.log("ALL JOBS:", allAdminJobs);
  console.log("SEARCH TEXT:", searchJobByText);


  const [filterJobs, setFilterJobs] = useState([]);

  //  SEARCH FILTER 
  useEffect(() => {
    const search = searchJobByText.trim().toLowerCase();

    const filtered = allAdminJobs.filter((job) => {
      console.log("JOB:", job);
      if (!search) return true;

      const title = job?.title?.toLowerCase() || "";
      const company = job?.company?.name?.toLowerCase() || "";

      return title.includes(search) || company.includes(search);
    });
    console.log("FILTERED:", filtered);

    setFilterJobs(filtered);
  }, [allAdminJobs, searchJobByText]);

  return (
    <div className="p-5 bg-white rounded-xl shadow">
      <Table>
        <TableCaption>List of your recent posted jobs</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allAdminJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No jobs posted yet.
              </TableCell>
            </TableRow>
          ) : filterJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No jobs found matching your search.
              </TableCell>
            </TableRow>
          ) : (
            filterJobs.map((job) => (
              <TableRow key={job._id}>

                {/* LOGO */}
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      src={
                        job?.company?.logo ||
                        "https://via.placeholder.com/40"
                      }
                    />
                  </Avatar>
                </TableCell>

                {/* COMPANY */}
                <TableCell>{job?.company?.name}</TableCell>

                {/* TITLE */}
                <TableCell>{job?.title}</TableCell>

                {/* DATE */}
                <TableCell>
                  {new Date(job?.createdAt).toLocaleDateString()}
                </TableCell>

                {/* ACTION */}
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <MoreHorizontal size={18} />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent className="w-40">
                      <button
                        onClick={() =>
                          navigate(`/admin/jobs/edit/${job._id}`)
                        }
                        className="flex items-center gap-2 w-full p-2 hover:bg-gray-100"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} className="flex items-center w-fit gap-2 cursor-pointer mt-2">
                        <Eye className="w-4 " />
                        <span>Applicant </span>


                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>

              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminJobsTable;