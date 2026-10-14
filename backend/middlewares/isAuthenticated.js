import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Also support Authorization Bearer token header if cookie is absent
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User account not found or has been deleted",
        success: false,
      });
    }

    req.id = user._id.toString();
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({
      message: "Token verification failed or expired",
      success: false,
    });
  }
};

// RBAC Middleware generator
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user?.role || "unknown"}' is not authorized to access this resource`,
        success: false,
      });
    }
    next();
  };
};

export const isRecruiter = authorizeRoles("recruiter");
export const isStudent = authorizeRoles("student");

export default isAuthenticated;