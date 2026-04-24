import React from 'react'
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import store from '@/redux/store'

function AppliedJobTable() {
  const { allAppliedJobs } = useSelector(store => store.job);
  return (
    <div>
      <Table>
        <TableCaption>list of your applied jobs </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead> Data </TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company </TableHead>
            <TableHead className="text-right"> Status </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            allAppliedJobs.length <= 0 ? <span> You haven't applied any job yet. </span> : allAppliedJobs.map((appliedjob) => (
              <TableRow key={appliedjob._id}>
                <TableCell> {appliedjob?.createdAt.split("T")[0]} </TableCell>
                <TableCell>{appliedjob?.job.title}</TableCell>
                <TableCell> {appliedjob?.job.company.name}</TableCell>
                {/* <TableCell className="text-right"> <Badge variant='outline' className={`${appliedjob.status === "Pending" ? " bg-yellow-600 " : appliedjob.status === "Rejected" ? "bg-red-700" : "bg-green-700"}`} > {appliedjob.status.toUpperCase()}</Badge> </TableCell> */}

                <TableCell className="text-right">
                  <Badge
                    className={`${appliedjob.status.toLowerCase() === "pending"
                        ? "bg-yellow-600 text-white rounded-md "
                        : appliedjob.status.toLowerCase() === "rejected"
                          ? "bg-red-700 text-white rounded-md"
                          : "bg-green-700 text-white rounded-md"
                      }`}
                  >
                    {appliedjob.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>

    </div>
  )
}

export default AppliedJobTable