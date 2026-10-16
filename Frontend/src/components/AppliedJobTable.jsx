import React, { useState } from 'react';
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from './ui/table';
import { Badge } from './ui/badge';
import { useSelector } from 'react-redux';
import {
  CheckCircle2,
  Clock,
  Calendar,
  Video,
  ChevronDown,
  ChevronUp,
  Building2,
  ExternalLink,
  XCircle,
  FileText,
} from 'lucide-react';
import { Button } from './ui/button';

// Standard 5-stage pipeline
const STAGES = [
  { key: 'applied', label: 'Applied', step: 1 },
  { key: 'under_review', label: 'In Review', step: 2 },
  { key: 'shortlisted', label: 'Shortlisted', step: 3 },
  { key: 'interview_scheduled', label: 'Interview', step: 4 },
  { key: 'accepted', label: 'Offer / Hired', step: 5 },
];

const getStepNumber = (status) => {
  const s = (status || 'applied').toLowerCase();
  switch (s) {
    case 'under_review':
      return 2;
    case 'shortlisted':
      return 3;
    case 'interview_scheduled':
      return 4;
    case 'accepted':
      return 5;
    case 'rejected':
      return -1; // Special rejected state
    case 'pending':
    case 'applied':
    default:
      return 1;
  }
};

const getStatusBadge = (status) => {
  const s = (status || 'applied').toLowerCase();
  switch (s) {
    case 'under_review':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">In Review</Badge>;
    case 'shortlisted':
      return <Badge className="bg-purple-100 text-[#6A38C2] hover:bg-purple-100 border-none font-semibold">Shortlisted</Badge>;
    case 'interview_scheduled':
      return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none font-semibold">Interview Scheduled</Badge>;
    case 'accepted':
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-semibold">Hired / Selected 🎉</Badge>;
    case 'rejected':
      return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none font-semibold">Not Selected</Badge>;
    case 'pending':
    case 'applied':
    default:
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Applied</Badge>;
  }
};

function AppliedJobTable() {
  const { allAppliedJobs } = useSelector((store) => store.job);
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <Table>
        <TableCaption className="pb-4">
          Click on any row to view full hiring pipeline & interview schedule
        </TableCaption>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold text-gray-700">Applied Date</TableHead>
            <TableHead className="font-semibold text-gray-700">Job Role & Company</TableHead>
            <TableHead className="font-semibold text-gray-700">Pipeline Status</TableHead>
            <TableHead className="font-semibold text-gray-700 hidden md:table-cell">Live Progress</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!allAppliedJobs || allAppliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                You haven't applied for any jobs yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedjob) => {
              const currentStep = getStepNumber(appliedjob?.status);
              const isRejected = appliedjob?.status?.toLowerCase() === 'rejected';
              const isExpanded = expandedRows[appliedjob?._id];
              const hasInterview =
                appliedjob?.status?.toLowerCase() === 'interview_scheduled' &&
                appliedjob?.interviewDetails?.meetingLink;

              return (
                <React.Fragment key={appliedjob._id}>
                  {/* Main Row */}
                  <TableRow
                    onClick={() => toggleRow(appliedjob._id)}
                    className="cursor-pointer hover:bg-gray-50/80 transition-colors"
                  >
                    {/* Date */}
                    <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                      {appliedjob?.createdAt?.split('T')[0]}
                    </TableCell>

                    {/* Job Role & Company */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-sm">
                          {appliedjob?.job?.title || 'Job Title'}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          {appliedjob?.job?.company?.name || 'Company'}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>{getStatusBadge(appliedjob?.status)}</TableCell>

                    {/* Quick Mini Stepper (Visible on md+) */}
                    <TableCell className="hidden md:table-cell py-3">
                      <div className="flex items-center gap-1.5">
                        {STAGES.map((stage, idx) => {
                          const isDone = !isRejected && currentStep >= stage.step;
                          const isCurrent = !isRejected && currentStep === stage.step;

                          return (
                            <React.Fragment key={stage.key}>
                              <div
                                title={stage.label}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                  isRejected
                                    ? 'bg-gray-100 text-gray-400'
                                    : isCurrent
                                    ? 'bg-[#6A38C2] text-white ring-2 ring-purple-200 ring-offset-1'
                                    : isDone
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {isDone && !isCurrent ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  stage.step
                                )}
                              </div>
                              {idx < STAGES.length - 1 && (
                                <div
                                  className={`h-0.5 w-4 sm:w-6 transition-colors ${
                                    !isRejected && currentStep > stage.step
                                      ? 'bg-emerald-500'
                                      : 'bg-gray-200'
                                  }`}
                                />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </TableCell>

                    {/* Expand/Collapse Toggle */}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRow(appliedjob._id);
                        }}
                        className="text-xs text-[#6A38C2] hover:text-[#522998] flex items-center gap-1 ml-auto"
                      >
                        <span className="hidden sm:inline">
                          {isExpanded ? 'Hide Pipeline' : 'Track Status'}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Pipeline Details Accordion */}
                  {isExpanded && (
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                      <TableCell colSpan={5} className="p-4 sm:p-6 border-t border-b border-gray-100">
                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-6">
                          
                          {/* Stepper Header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-3">
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">
                                Application Hiring Journey
                              </h4>
                              <p className="text-xs text-gray-500">
                                Real-time status updates from the hiring team at{' '}
                                <span className="font-medium text-gray-700">
                                  {appliedjob?.job?.company?.name}
                                </span>
                              </p>
                            </div>
                            <div>{getStatusBadge(appliedjob?.status)}</div>
                          </div>

                          {/* Detailed Visual Stepper */}
                          <div className="py-2">
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                              {STAGES.map((stage) => {
                                const isDone = !isRejected && currentStep >= stage.step;
                                const isCurrent = !isRejected && currentStep === stage.step;

                                return (
                                  <div
                                    key={stage.key}
                                    className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                                      isRejected && isCurrent
                                        ? 'border-rose-300 bg-rose-50/50 text-rose-800'
                                        : isCurrent
                                        ? 'border-[#6A38C2] bg-purple-50/60 shadow-xs ring-1 ring-[#6A38C2]/20'
                                        : isDone
                                        ? 'border-emerald-200 bg-emerald-50/30'
                                        : 'border-gray-200 bg-gray-50/40 text-gray-400'
                                    }`}
                                  >
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                                        isRejected && isCurrent
                                          ? 'bg-rose-600 text-white'
                                          : isCurrent
                                          ? 'bg-[#6A38C2] text-white'
                                          : isDone
                                          ? 'bg-emerald-600 text-white'
                                          : 'bg-gray-200 text-gray-500'
                                      }`}
                                    >
                                      {isDone && !isCurrent ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                      ) : (
                                        stage.step
                                      )}
                                    </div>
                                    <span
                                      className={`text-xs font-semibold ${
                                        isCurrent
                                          ? 'text-[#6A38C2]'
                                          : isDone
                                          ? 'text-gray-900'
                                          : 'text-gray-400'
                                      }`}
                                    >
                                      {stage.label}
                                    </span>
                                    <span className="text-[10px] text-gray-500 mt-0.5">
                                      {isCurrent
                                        ? 'Current Stage'
                                        : isDone
                                        ? 'Completed'
                                        : 'Pending'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Scheduled Interview Banner */}
                          {hasInterview && (
                            <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4 sm:p-5">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="p-1.5 bg-[#6A38C2] text-white rounded-lg">
                                      <Video className="w-4 h-4" />
                                    </span>
                                    <h5 className="font-bold text-gray-900 text-sm">
                                      {appliedjob.interviewDetails.roundName || 'Interview Scheduled'}
                                    </h5>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-2">
                                    <span className="flex items-center gap-1 font-medium">
                                      <Calendar className="w-3.5 h-3.5 text-[#6A38C2]" />
                                      {appliedjob.interviewDetails.interviewDate}
                                    </span>
                                    {appliedjob.interviewDetails.interviewTime && (
                                      <span className="flex items-center gap-1 font-medium">
                                        <Clock className="w-3.5 h-3.5 text-[#6A38C2]" />
                                        {appliedjob.interviewDetails.interviewTime}
                                      </span>
                                    )}
                                  </div>
                                  {appliedjob.interviewDetails.notes && (
                                    <p className="text-xs text-gray-600 mt-1 italic flex items-center gap-1">
                                      <FileText className="w-3.5 h-3.5 text-gray-400 inline" />
                                      "{appliedjob.interviewDetails.notes}"
                                    </p>
                                  )}
                                </div>

                                <a
                                  href={appliedjob.interviewDetails.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full sm:w-auto"
                                >
                                  <Button className="w-full sm:w-auto bg-[#6A38C2] hover:bg-[#582fa5] text-white font-medium text-xs flex items-center gap-2 px-5 py-2 shadow-sm">
                                    <Video className="w-4 h-4" />
                                    <span>Join Interview (Google Meet)</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </Button>
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Rejection Note */}
                          {isRejected && (
                            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-800 text-xs">
                              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold text-rose-900">Application Status Update</p>
                                <p className="text-rose-700 mt-0.5">
                                  Thank you for your interest in this role. The hiring team has decided to move forward with other candidates for this position. Keep exploring other open jobs!
                                </p>
                              </div>
                            </div>
                          )}

                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default AppliedJobTable;