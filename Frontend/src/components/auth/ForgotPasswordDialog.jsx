import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/Utils/constant";
import {
  Loader2,
  Mail,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
  RotateCcw,
  X,
} from "lucide-react";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ForgotPasswordDialog = ({ open, setOpen, initialEmail = "" }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Sync initial email when modal opens
  useEffect(() => {
    if (open) {
      if (initialEmail) {
        setEmail(initialEmail);
      }
      setStep(1);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [open, initialEmail]);

  // Resend OTP countdown timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // STEP 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      toast.error("Please enter your registered email address");
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/forgot-password`,
        { email: cleanEmail },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Verification code sent to your email!");
        setTimer(60); // 60s cooldown
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (timer > 0 || resendLoading) return;
    try {
      setResendLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/forgot-password`,
        { email: email.trim().toLowerCase() },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success("A fresh verification code has been sent to your email!");
        setTimer(60);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const cleanOtp = otp.trim().replace(/\D/g, "");
    if (!cleanOtp || cleanOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/verify-otp`,
        {
          email: email.trim().toLowerCase(),
          otp: cleanOtp,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Code verified successfully!");
        setStep(3);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please check and try again.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/reset-password`,
        {
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Password reset successful!");
        setStep(4);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[460px] p-0 overflow-hidden rounded-2xl border border-gray-100 shadow-2xl bg-white text-gray-900 z-50"
      >
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-[#6A38C2] to-[#7f4fe3] text-white p-6 pb-5">
          {/* Custom White Close Button */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1.5 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 pr-8">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm shrink-0">
              {step === 1 && <Mail className="w-5 h-5 text-white" />}
              {step === 2 && <KeyRound className="w-5 h-5 text-white" />}
              {step === 3 && <ShieldCheck className="w-5 h-5 text-white" />}
              {step === 4 && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white tracking-tight">
                {step === 1 && "Forgot Password"}
                {step === 2 && "Enter Verification Code"}
                {step === 3 && "Create New Password"}
                {step === 4 && "Password Reset Complete!"}
              </DialogTitle>
              <DialogDescription className="text-purple-100 text-xs mt-0.5">
                {step === 1 && "Enter your email to receive a secure 6-digit OTP"}
                {step === 2 && `Code sent to ${email}`}
                {step === 3 && "Choose a strong password with at least 6 characters"}
                {step === 4 && "You can now log in with your updated credentials"}
              </DialogDescription>
            </div>
          </div>

          {/* Stepper Dots (Steps 1-3) */}
          {step < 4 && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/15">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    s === step
                      ? "bg-white"
                      : s < step
                      ? "bg-emerald-300"
                      : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 pt-5 bg-white">
          {/* STEP 1: Email Form */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-sm font-semibold text-gray-700">
                  Registered Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@company.com"
                    className="pl-10 h-11 focus-visible:ring-[#6A38C2] rounded-xl"
                    autoFocus
                    required
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
                <p className="text-xs text-gray-500">
                  We'll send a 6-digit cryptographic verification code to this email.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-[#6A38C2] hover:bg-[#5a2eb0] text-white font-medium rounded-xl shadow-md transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Verification Code...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* STEP 2: OTP Form */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="reset-otp" className="text-sm font-semibold text-gray-700">
                    6-Digit Verification Code
                  </Label>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-[#6A38C2] hover:underline flex items-center gap-1 font-medium"
                  >
                    <ArrowLeft className="w-3 h-3" /> Change Email
                  </button>
                </div>

                <Input
                  id="reset-otp"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="• • • • • •"
                  className="h-14 text-center text-2xl font-mono tracking-[12px] font-bold focus-visible:ring-[#6A38C2] rounded-xl bg-purple-50/40 border-purple-200"
                  autoFocus
                  required
                />
                <p className="text-xs text-gray-500 text-center">
                  Code expires in 10 minutes. Check your inbox and spam folder.
                </p>
              </div>

              {/* Resend Cooldown Timer */}
              <div className="text-center text-xs py-1">
                {timer > 0 ? (
                  <span className="text-gray-500">
                    Resend code in{" "}
                    <strong className="text-[#6A38C2] font-semibold">
                      00:{timer < 10 ? `0${timer}` : timer}
                    </strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    className="text-[#6A38C2] hover:underline font-semibold flex items-center justify-center gap-1.5 mx-auto"
                  >
                    {resendLoading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" /> Resending...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3 h-3" /> Didn't receive code? Resend
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading || otp.trim().length !== 6}
                  className="w-full h-11 bg-[#6A38C2] hover:bg-[#5a2eb0] text-white font-medium rounded-xl shadow-md transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying Code...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: New Password Form */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-semibold text-gray-700">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="pr-10 h-11 focus-visible:ring-[#6A38C2] rounded-xl"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="pr-10 h-11 focus-visible:ring-[#6A38C2] rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 font-medium">
                    ⚠️ Passwords do not match
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading || !newPassword || newPassword !== confirmPassword}
                  className="w-full h-11 bg-[#6A38C2] hover:bg-[#5a2eb0] text-white font-medium rounded-xl shadow-md transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* STEP 4: Success View */}
          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Password Updated Successfully!
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Your credentials have been securely updated. You can now log into your account with your new password.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  type="button"
                  onClick={handleFinish}
                  className="w-full h-11 bg-[#6A38C2] hover:bg-[#5a2eb0] text-white font-medium rounded-xl shadow-md"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
