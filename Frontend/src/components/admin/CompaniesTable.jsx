
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
import { AvatarImage, Avatar } from "../ui/avatar";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { MoreHorizontal, Edit2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CompaniesTable() {
    const { companies = [], searchCompanyByText = "" } = useSelector((store) => store.company);
    const navigate = useNavigate();

    const filterCompany = useMemo(() => {
        const search = searchCompanyByText.trim().toLowerCase();

        return companies.filter((company) => {
            if (!search) return true;
            return company?.name?.toLowerCase().includes(search);
        });
    }, [companies, searchCompanyByText]);

    return (
        <div className="p-5 bg-white rounded-xl shadow">
            <Table>
                <TableCaption>List of your registered companies</TableCaption>

                {/* TABLE HEADER */}
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>

                {/* TABLE BODY */}
                <TableBody>
                    {companies.length <= 0 ? (
                        // Empty state - koi company nahi
                        <TableRow>
                            <TableCell colSpan="4" className="text-center py-8 text-gray-500">
                                You haven't registered any company yet.
                            </TableCell>
                        </TableRow>
                    ) : filterCompany.length === 0 ? (
                        // No search results
                        <TableRow>
                            <TableCell colSpan="4" className="text-center py-8 text-gray-500">
                                No companies found matching your search.
                            </TableCell>
                        </TableRow>
                    ) : (
                        // Companies display karo
                        filterCompany.map((company) => (
                            <TableRow key={company._id}>
                                {/* Logo */}
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage
                                            src={company.logo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvDxGmA596-b4RHHw24fP5UtONGEilzMI0Ow&s"}
                                            alt={company.name}
                                        />
                                    </Avatar>
                                </TableCell>

                                {/* Name */}
                                <TableCell className="font-medium">{company.name}</TableCell>

                                {/* Date */}
                                <TableCell>
                                    {new Date(company.createdAt).toLocaleDateString()}
                                </TableCell>

                                {/* Action Menu */}
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40" align="end">
                                            <div onClick={() => navigate(`/admin/companies/${company._id}`)} className="space-y-2">
                                                {/* Edit Option */}
                                                <button className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded cursor-pointer text-sm">
                                                    <Edit2 size={16} />
                                                    <span>Edit</span>
                                                </button>

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

export default CompaniesTable;