import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import {
  Contact,
  Mail,
  Pen,
  Bookmark,
  Briefcase,
  Building2,
  Users,
  Plus,
  ExternalLink,
  Edit2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import useGetSavedJobs from '@/hooks/useGetSavedJobs';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import UseGetAllCompanies from '@/hooks/useGetAllCompanies';
import Job from './Job';
import { Link } from 'react-router-dom';

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const isRecruiter = user?.role === 'recruiter';

  // Candidate hooks
  useGetAppliedJobs();
  useGetSavedJobs();

  // Recruiter hooks
  useGetAllAdminJobs();
  UseGetAllCompanies();

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(isRecruiter ? 'posted_jobs' : 'applied');

  const { allSavedJobs, allAppliedJobs, allAdminJobs } = useSelector((state) => state.job);
  const { companies } = useSelector((state) => state.company);

  // Recruiter Analytics Stats
  const totalJobsPosted = allAdminJobs?.length || 0;
  const totalApplicantsReceived =
    allAdminJobs?.reduce((acc, job) => acc + (job?.applications?.length || 0), 0) || 0;
  const totalCompaniesManaged = companies?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 mt-8 space-y-6">
        
        {/* ================= USER MAIN PROFILE CARD ================= */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            
            {/* Avatar & Basic Info */}
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 ring-4 ring-purple-50">
                {user?.profile?.profilePicture ? (
                  <AvatarImage
                    src={user.profile.profilePicture}
                    alt={user?.fullname}
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-[#6A38C2] text-white text-2xl font-bold">
                    {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-bold text-2xl text-gray-900">
                    {user?.fullname || 'User'}
                  </h1>
                  <Badge
                    className={
                      isRecruiter
                        ? 'bg-purple-100 text-[#6A38C2] border-none font-semibold text-xs'
                        : 'bg-blue-100 text-blue-700 border-none font-semibold text-xs'
                    }
                  >
                    {isRecruiter ? 'Recruiter / Employer' : 'Candidate / Student'}
                  </Badge>
                </div>
                <p className="text-gray-500 text-sm mt-1 max-w-md">
                  {user?.profile?.bio ||
                    (isRecruiter
                      ? 'Talent Acquisition & Hiring Manager'
                      : 'Looking for exciting job opportunities')}
                </p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="flex items-center gap-2 border-gray-300 hover:border-[#6A38C2] hover:text-[#6A38C2] text-xs font-medium"
            >
              <Pen className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Button>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Email Address</p>
                <p className="text-gray-800 font-medium">{user?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                <Contact className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Phone Number</p>
                <p className="text-gray-800 font-medium">{user?.phoneNumber || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* ================= STUDENT ONLY: SKILLS & RESUME ================= */}
          {!isRecruiter && (
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(user?.profile?.skills) && user.profile.skills.length > 0 ? (
                    user.profile.skills.map((item, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-purple-50 text-[#6A38C2] border border-purple-200"
                      >
                        {item}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No skills added yet.</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1.5">Resume</h3>
                {user?.profile?.resume ? (
                  <a
                    href={user.profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#6A38C2] hover:underline font-medium bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200"
                  >
                    <span>{user.profile.resumeOrignalName || 'View Resume Document'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-gray-400">No resume uploaded yet.</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= RECRUITER SPECIFIC DASHBOARD ================= */}
        {isRecruiter ? (
          <div className="space-y-6">
            
            {/* KPI Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Jobs Posted
                  </p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">
                    {totalJobsPosted}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Active Job Listings</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 text-[#6A38C2] rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total Applicants
                  </p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">
                    {totalApplicantsReceived}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Candidates Applied</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Companies
                  </p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">
                    {totalCompaniesManaged}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Registered Organizations</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Quick Actions Toolbar */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6A38C2]" />
                Hiring Management
              </span>

              <div className="flex items-center gap-2 flex-wrap">
                <Link to="/admin/jobs/create">
                  <Button className="bg-[#6A38C2] hover:bg-[#582fa5] text-white text-xs flex items-center gap-1.5 px-4">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post New Job</span>
                  </Button>
                </Link>

                <Link to="/admin/companies/create">
                  <Button
                    variant="outline"
                    className="border-purple-200 text-[#6A38C2] hover:bg-purple-50 text-xs flex items-center gap-1.5 px-4"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Register Company</span>
                  </Button>
                </Link>

                <Link to="/admin/jobs">
                  <Button variant="outline" className="text-xs px-3">
                    View All Jobs Table
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recruiter Tabs: Posted Jobs vs Companies */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-6 border-b border-gray-200 pb-2 mb-6">
                <button
                  onClick={() => setActiveTab('posted_jobs')}
                  className={`flex items-center gap-2 pb-2 px-1 font-semibold text-sm transition-all border-b-2 ${
                    activeTab === 'posted_jobs'
                      ? 'border-[#6A38C2] text-[#6A38C2]'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>My Posted Jobs ({totalJobsPosted})</span>
                </button>

                <button
                  onClick={() => setActiveTab('my_companies')}
                  className={`flex items-center gap-2 pb-2 px-1 font-semibold text-sm transition-all border-b-2 ${
                    activeTab === 'my_companies'
                      ? 'border-[#6A38C2] text-[#6A38C2]'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>My Companies ({totalCompaniesManaged})</span>
                </button>
              </div>

              {/* Tab 1: Posted Jobs List */}
              {activeTab === 'posted_jobs' && (
                <div>
                  {allAdminJobs?.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <Briefcase className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                      <h4 className="text-base font-bold text-gray-800">No jobs posted yet</h4>
                      <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
                        Start posting open positions to attract qualified candidates.
                      </p>
                      <Link to="/admin/jobs/create">
                        <Button className="bg-[#6A38C2] hover:bg-[#582fa5] text-white text-xs px-5">
                          Post Your First Job
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {allAdminJobs.map((job) => (
                        <div
                          key={job._id}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-xs transition-all gap-4 bg-gray-50/40"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                                {job.title}
                              </h4>
                              <Badge className="bg-blue-50 text-blue-700 border-none text-[11px]">
                                {job.jobType}
                              </Badge>
                              <Badge className="bg-purple-50 text-[#6A38C2] border-none text-[11px]">
                                ₹{job.salary} LPA
                              </Badge>
                            </div>

                            <p className="text-xs text-gray-500 flex items-center gap-2">
                              <span className="font-medium text-gray-700">
                                {job.company?.name || 'Company'}
                              </span>
                              <span>•</span>
                              <span>{job.location}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {job.createdAt?.split('T')[0]}
                              </span>
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <Link to={`/admin/jobs/${job._id}/applicants`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs font-semibold text-[#6A38C2] border-purple-200 hover:bg-purple-50 flex items-center gap-1.5"
                              >
                                <Users className="w-3.5 h-3.5" />
                                <span>{job.applications?.length || 0} Applicants</span>
                              </Button>
                            </Link>

                            <Link to={`/admin/jobs/edit/${job._id}`}>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs text-gray-600 hover:bg-gray-100 flex items-center gap-1"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Companies List */}
              {activeTab === 'my_companies' && (
                <div>
                  {companies?.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <Building2 className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                      <h4 className="text-base font-bold text-gray-800">No companies registered</h4>
                      <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
                        Register your organization details before posting job openings.
                      </p>
                      <Link to="/admin/companies/create">
                        <Button className="bg-[#6A38C2] hover:bg-[#582fa5] text-white text-xs px-5">
                          Register Company
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {companies.map((company) => (
                        <div
                          key={company._id}
                          className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:shadow-xs transition-all bg-gray-50/40"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border border-gray-200">
                              <AvatarImage src={company.logo} alt={company.name} />
                              <AvatarFallback className="bg-gray-200 text-gray-700 font-bold">
                                {company.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-bold text-sm text-gray-900">{company.name}</h4>
                              <p className="text-xs text-gray-500">{company.location || 'India'}</p>
                              {company.website && (
                                <a
                                  href={company.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-[#6A38C2] hover:underline flex items-center gap-0.5 mt-0.5"
                                >
                                  <span>Website</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>

                          <Link to={`/admin/companies/${company._id}`}>
                            <Button size="sm" variant="outline" className="text-xs">
                              Setup / Edit
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        ) : (
          /* ================= CANDIDATE SPECIFIC TABS ================= */
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 border-b border-gray-200 pb-2 mb-6">
              <button
                onClick={() => setActiveTab('applied')}
                className={`flex items-center gap-2 pb-2 px-1 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === 'applied'
                    ? 'border-[#6A38C2] text-[#6A38C2]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Applied Jobs ({allAppliedJobs?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('saved')}
                className={`flex items-center gap-2 pb-2 px-1 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === 'saved'
                    ? 'border-[#6A38C2] text-[#6A38C2]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Saved Jobs ({allSavedJobs?.length || 0})</span>
              </button>
            </div>

            {activeTab === 'applied' ? (
              <AppliedJobTable />
            ) : (
              <div>
                {allSavedJobs?.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Bookmark className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm mb-4">No saved jobs yet.</p>
                    <Link to="/jobs">
                      <Button className="bg-[#6A38C2] hover:bg-[#5a2fa3] text-white text-xs px-4 py-1.5">
                        Explore Jobs
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allSavedJobs.map((job) => (
                      <Job key={job._id} job={job} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      <UpdateProfileDialog open={open} setopen={setOpen} />
    </div>
  );
}

export default Profile;