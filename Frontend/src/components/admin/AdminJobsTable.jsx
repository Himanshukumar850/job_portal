
import React, { useMemo } from "react";
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

function AdminJobsTable() {
  const navigate = useNavigate();

  const { allAdminJobs = [], searchJobByText = "" } = useSelector(
    (store) => store.job
  );

  const filterJobs = useMemo(() => {
    const search = searchJobByText.trim().toLowerCase();

    return allAdminJobs.filter((job) => {
      if (!search) return true;

      const title = job?.title?.toLowerCase() || "";
      const company = job?.company?.name?.toLowerCase() || "";

      return title.includes(search) || company.includes(search);
    });
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
            <TableHead>Applicants</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allAdminJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No jobs posted yet.
              </TableCell>
            </TableRow>
          ) : filterJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
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

                <TableCell>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                    className="text-[#6A38C2] hover:underline"
                  >
                    {job?.applications?.length || 0} · View
                  </button>
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
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        className="flex items-center w-full gap-2 p-2 hover:bg-gray-100"
                      >
                        <Eye className="w-4" />
                        <span>View applicants</span>
                      </button>
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