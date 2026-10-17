import nodemailer from "nodemailer";

// Initialize Transporter
const createTransporter = () => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();

  if (!user || !pass) {
    return null; // Will trigger development simulation mode
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST?.trim() || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user,
      pass,
    },
  });
};

// Generate Google Calendar 1-Click Event Link
export const generateGoogleCalendarLink = ({
  title,
  description,
  location,
  interviewDate,
  interviewTime,
}) => {
  try {
    // Parse date and time (e.g., date: "2026-10-20", time: "14:30")
    let startDateTime;
    if (interviewDate) {
      const timeStr = interviewTime && interviewTime !== "TBD" ? interviewTime : "10:00";
      const combined = `${interviewDate}T${timeStr}:00`;
      const dateObj = new Date(combined);
      if (!isNaN(dateObj.getTime())) {
        startDateTime = dateObj;
      }
    }

    if (!startDateTime) {
      startDateTime = new Date();
      startDateTime.setDate(startDateTime.getDate() + 1);
    }

    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    const formatGoogleDate = (date) =>
      date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const startFormatted = formatGoogleDate(startDateTime);
    const endFormatted = formatGoogleDate(endDateTime);

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title || "Job Interview",
      dates: `${startFormatted}/${endFormatted}`,
      details: description || "Interview scheduled via Job Portal",
      location: location || "Online Meeting",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch {
    return "https://calendar.google.com";
  }
};

// High-Conversion, Dark-Mode Compatible HTML Templates
const getBaseEmailWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Portal Notification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f8fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2d3748; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f8fb; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <!-- Brand Header -->
          <tr>
            <td style="background-color: #6A38C2; padding: 24px 32px; text-align: left;">
              <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">
                Job <span style="color: #ffb703;">Portal</span>
              </h2>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #edf2f7; text-align: center; color: #a0aec0; font-size: 12px;">
              <p style="margin: 0;">This is an automated notification from Job Portal Hiring System.</p>
              <p style="margin: 4px 0 0 0;">© ${new Date().getFullYear()} Job Portal. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// 1. INTERVIEW INVITATION TEMPLATE
export const getInterviewEmailTemplate = ({
  candidateName,
  jobTitle,
  companyName,
  roundName,
  interviewDate,
  interviewTime,
  meetingLink,
  calendarUrl,
  notes,
}) => {
  const content = `
    <h1 style="color: #1a202c; font-size: 22px; font-weight: 700; margin: 0 0 12px 0;">
      Interview Invitation: ${jobTitle}
    </h1>
    <p style="color: #4a5568; font-size: 15px; margin: 0 0 20px 0;">
      Hi <strong>${candidateName}</strong>,
    </p>
    <p style="color: #4a5568; font-size: 15px; margin: 0 0 24px 0;">
      Great news! The hiring team at <strong>${companyName}</strong> was impressed by your profile and has invited you to an interview for the <strong>${jobTitle}</strong> position.
    </p>

    <!-- Schedule Highlight Box -->
    <div style="background-color: #f7f5ff; border: 1px solid #e9d8fd; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; color: #6A38C2; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
        Interview Details
      </h3>
      <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px; color: #2d3748;">
        <tr>
          <td width="130" style="color: #718096; font-weight: 600;">Round:</td>
          <td><strong>${roundName || "Technical Interview"}</strong></td>
        </tr>
        <tr>
          <td style="color: #718096; font-weight: 600;">Date:</td>
          <td><strong>${interviewDate}</strong></td>
        </tr>
        <tr>
          <td style="color: #718096; font-weight: 600;">Time:</td>
          <td><strong>${interviewTime || "Scheduled Time"}</strong></td>
        </tr>
        <tr>
          <td style="color: #718096; font-weight: 600;">Platform:</td>
          <td>Online Video Meeting</td>
        </tr>
      </table>

      ${
        notes
          ? `
        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #d6bcfa; font-size: 13px; color: #4a5568;">
          <strong>Recruiter Note:</strong> "${notes}"
        </div>
      `
          : ""
      }
    </div>

    <!-- Call to Actions -->
    <div style="text-align: center; margin-bottom: 28px;">
      <a href="${meetingLink}" target="_blank" style="display: inline-block; background-color: #6A38C2; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px; padding: 12px 28px; border-radius: 8px; box-shadow: 0 4px 10px rgba(106, 56, 194, 0.3);">
        Join Video Meeting
      </a>
      <div style="margin-top: 12px;">
        <a href="${calendarUrl}" target="_blank" style="display: inline-block; color: #6A38C2; background-color: #f3e8ff; text-decoration: none; font-weight: 600; font-size: 13px; padding: 8px 18px; border-radius: 6px;">
          📅 Add to Google Calendar
        </a>
      </div>
    </div>

    <p style="font-size: 13px; color: #718096; margin: 0;">
      Please ensure your camera and microphone are working properly before joining. Good luck with your preparation!
    </p>
  `;

  return getBaseEmailWrapper(content);
};

// 2. APPLICATION CONFIRMATION TEMPLATE
export const getApplicationEmailTemplate = ({
  candidateName,
  jobTitle,
  companyName,
  portalUrl,
}) => {
  const content = `
    <h1 style="color: #1a202c; font-size: 22px; font-weight: 700; margin: 0 0 12px 0;">
      Application Submitted! 🎉
    </h1>
    <p style="color: #4a5568; font-size: 15px; margin: 0 0 20px 0;">
      Hi <strong>${candidateName}</strong>,
    </p>
    <p style="color: #4a5568; font-size: 15px; margin: 0 0 24px 0;">
      Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been successfully received by the hiring team.
    </p>
    <div style="background-color: #f7fafc; border: 1px solid #edf2f7; border-radius: 12px; padding: 20px; margin-bottom: 24px; font-size: 14px;">
      <p style="margin: 0; color: #4a5568;">
        The recruitment team will review your profile and experience against the job requirements. You can track your real-time application status anytime on your portal profile.
      </p>
    </div>
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${portalUrl || "http://localhost:5173/profile"}" target="_blank" style="display: inline-block; background-color: #6A38C2; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px;">
        Track Application Status
      </a>
    </div>
  `;

  return getBaseEmailWrapper(content);
};

// 3. STATUS UPDATE TEMPLATE (Shortlisted / Hired / Rejected)
export const getStatusUpdateEmailTemplate = ({
  candidateName,
  jobTitle,
  companyName,
  status,
  notes,
  portalUrl,
}) => {
  const isShortlisted = status === "shortlisted";
  const isAccepted = status === "accepted";
  const isUnderReview = status === "under_review";

  const title = isAccepted
    ? "Congratulations! Job Offer / Selected 🎉"
    : isShortlisted
    ? "Congratulations! You are Shortlisted ⭐"
    : isUnderReview
    ? "Application Update: Under Review 📋"
    : "Application Update";

  const message = isAccepted
    ? `We are thrilled to inform you that you have been selected for the <strong>${jobTitle}</strong> role at <strong>${companyName}</strong>!`
    : isShortlisted
    ? `Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been shortlisted for the next stage of hiring.`
    : isUnderReview
    ? `Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> is now being actively reviewed by the hiring manager.`
    : `Thank you for your interest in the <strong>${jobTitle}</strong> role at <strong>${companyName}</strong>. After careful consideration, the hiring team has decided to move forward with other candidates at this time. We encourage you to keep exploring other exciting roles!`;

  const content = `
    <h1 style="color: #1a202c; font-size: 22px; font-weight: 700; margin: 0 0 12px 0;">
      ${title}
    </h1>
    <p style="color: #4a5568; font-size: 15px; margin: 0 0 20px 0;">
      Hi <strong>${candidateName}</strong>,
    </p>
    <p style="color: #4a5568; font-size: 15px; margin: 0 0 20px 0;">
      ${message}
    </p>
    ${
      notes
        ? `
      <div style="background-color: #f7fafc; border-left: 4px solid #6A38C2; padding: 14px; margin-bottom: 24px; font-size: 13px; color: #4a5568;">
        <strong>Hiring Team Note:</strong> ${notes}
      </div>
    `
        : ""
    }
    <div style="text-align: center; margin-bottom: 20px;">
      <a href="${portalUrl || "http://localhost:5173/profile"}" target="_blank" style="display: inline-block; background-color: #6A38C2; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px;">
        View Status on Portal
      </a>
    </div>
  `;

  return getBaseEmailWrapper(content);
};

// 4. OTP / PASSWORD RESET TEMPLATE
export const getOtpEmailTemplate = ({ userName, otp }) => {
  const content = `
    <h1 style="color: #1a202c; font-size: 22px; font-weight: 700; margin: 0 0 12px 0;">
      Password Reset Request 🔐
    </h1>
    <p style="color: #4a5568; font-size: 15px; margin: 0 0 16px 0;">
      Hi <strong>${userName || "User"}</strong>,
    </p>
    <p style="color: #4a5568; font-size: 15px; margin: 0 0 24px 0;">
      We received a request to reset your password for your <strong>Job Portal</strong> account. Use the 6-digit verification code below to complete the reset process:
    </p>

    <!-- OTP Display Box -->
    <div style="background: linear-gradient(135deg, #f7f5ff 0%, #efeaff 100%); border: 2px dashed #6A38C2; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
      <p style="margin: 0 0 8px 0; color: #6A38C2; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
        Your 6-Digit Verification Code
      </p>
      <div style="font-size: 38px; font-weight: 800; color: #6A38C2; letter-spacing: 12px; font-family: 'Courier New', Courier, monospace; margin: 8px 0;">
        ${otp}
      </div>
      <p style="margin: 8px 0 0 0; color: #718096; font-size: 13px;">
        ⏱️ Valid for <strong>10 minutes</strong> only
      </p>
    </div>

    <div style="background-color: #fffaf0; border-left: 4px solid #dd6b20; border-radius: 6px; padding: 14px 16px; margin-bottom: 24px; font-size: 13px; color: #7b341e; line-height: 1.5;">
      <strong>⚠️ Security Notice:</strong> Never share this verification code with anyone. Job Portal staff will never ask for your password or OTP. If you did not make this request, your account is safe and you can ignore this email.
    </div>
  `;

  return getBaseEmailWrapper(content);
};

// Non-Blocking Asynchronous Email Sender (Zero API Latency)
export const sendEmailAsync = ({ to, subject, html, text }) => {
  // Execute in background without blocking calling thread
  setImmediate(async () => {
    try {
      const transporter = createTransporter();
      const from = process.env.EMAIL_FROM || `"Job Portal Hiring" <${process.env.EMAIL_USER || "noreply@jobportal.com"}>`;

      if (!transporter) {
        // Development Simulation Mode
        console.log(`\n================== [EMAIL SIMULATION (DEV MODE)] ==================`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Status: Simulated Delivery (Set EMAIL_USER & EMAIL_PASS in .env to send live emails)`);
        console.log(`===================================================================\n`);
        return;
      }

      await transporter.sendMail({
        from,
        to,
        subject,
        html,
        text: text || "You have an update regarding your job application.",
      });
    } catch (err) {
      console.error(`⚠️ [Email Delivery Error - Non-Blocking]:`, err.message);
    }
  });
};
