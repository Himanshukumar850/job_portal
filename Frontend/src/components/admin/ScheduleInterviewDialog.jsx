import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Calendar, Clock, Video, FileText } from "lucide-react";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/Utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setApplicantStatus } from "@/redux/applicationSliice";

const ScheduleInterviewDialog = ({ open, setOpen, applicant }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roundName: "Technical Round 1",
    interviewDate: "",
    interviewTime: "",
    meetingLink: "",
    notes: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.interviewDate) {
      toast.error("Please select an interview date");
      return;
    }

    if (!formData.interviewTime) {
      toast.error("Please select an interview time");
      return;
    }

    if (!formData.meetingLink || !formData.meetingLink.trim()) {
      toast.error("Please provide a meeting link (Google Meet / Zoom)");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${applicant?._id}/update`,
        {
          status: "interview_scheduled",
          roundName: formData.roundName.trim(),
          interviewDate: formData.interviewDate,
          interviewTime: formData.interviewTime,
          meetingLink: formData.meetingLink.trim(),
          notes: formData.notes.trim(),
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Interview scheduled successfully!");
        dispatch(
          setApplicantStatus({
            applicationId: applicant?._id,
            status: "interview_scheduled",
            interviewDetails: {
              roundName: formData.roundName.trim(),
              interviewDate: formData.interviewDate,
              interviewTime: formData.interviewTime,
              meetingLink: formData.meetingLink.trim(),
              notes: formData.notes.trim(),
            },
          })
        );
        setOpen(false);
      }
    } catch (error) {
      console.error("Schedule Interview Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to schedule interview"
      );
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-900">
            <Calendar className="w-5 h-5 text-[#6A38C2]" />
            <span>Schedule Interview</span>
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1">
            Candidate:{" "}
            <span className="font-semibold text-gray-700">
              {applicant?.applicant?.fullname || "Applicant"}
            </span>{" "}
            ({applicant?.applicant?.email || ""})
          </p>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-4 mt-3">
          <div>
            <Label className="text-xs font-semibold text-gray-700">
              Interview Round
            </Label>
            <Input
              name="roundName"
              value={formData.roundName}
              onChange={changeHandler}
              placeholder="e.g. Technical Round 1, System Design, HR"
              className="mt-1 focus:ring-2 focus:ring-[#6A38C2]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                Date
              </Label>
              <Input
                type="date"
                min={today}
                name="interviewDate"
                value={formData.interviewDate}
                onChange={changeHandler}
                required
                className="mt-1 focus:ring-2 focus:ring-[#6A38C2]"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                Time
              </Label>
              <Input
                type="time"
                name="interviewTime"
                value={formData.interviewTime}
                onChange={changeHandler}
                required
                className="mt-1 focus:ring-2 focus:ring-[#6A38C2]"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-gray-400" />
              Meeting Link (Google Meet / Zoom / Teams)
            </Label>
            <Input
              type="url"
              name="meetingLink"
              value={formData.meetingLink}
              onChange={changeHandler}
              placeholder="https://meet.google.com/xyz-abcd-efg"
              required
              className="mt-1 focus:ring-2 focus:ring-[#6A38C2]"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              Notes / Instructions for Candidate (Optional)
            </Label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={changeHandler}
              placeholder="e.g. Please be prepared with your laptop and portfolio projects."
              className="mt-1 w-full text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6A38C2]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#6A38C2] hover:bg-[#592fa7] text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Scheduling...
                </>
              ) : (
                "Confirm & Schedule"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleInterviewDialog;
