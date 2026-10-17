
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js"
import applicationRoute from "./routes/application.route.js";
import notificationRoute from "./routes/notification.route.js";

dotenv.config({ path: "./.env" });
// dotenv.config({});
const app = express();

//middleware 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const allowedOrigins = (
    process.env.CORS_ORIGINS ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173"
)
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // allow non-browser clients (curl/postman) with no Origin header
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
    })
);


const PORT = process.env.PORT || 3000;
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/application",applicationRoute);
app.use("/api/v1/notification", notificationRoute);
// Base route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Job Portal backend is running",
    });
});

// 404 handler for undefined API routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Caught:", err.stack || err.message || err);

    // Mongoose CastError (e.g. invalid ObjectId)
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: `Resource not found. Invalid ID: ${err.value}`,
        });
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        return res.status(400).json({
            success: false,
            message: `Duplicate value entered for ${field}. Please use another value.`,
        });
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((val) => val.message);
        return res.status(400).json({
            success: false,
            message: messages.join(", "),
        });
    }

    // JWT Errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            message: "Invalid token. Please authenticate again.",
        });
    }
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Token has expired. Please login again.",
        });
    }

    // Generic fallback
    const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server due to DB connection error:", err.message);
    }
};

startServer();
