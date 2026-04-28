
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js"
import applicationRoute from "./routes/application.route.js";

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
// api's

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Job Portal backend is running",
    });
});




app.listen(PORT,() =>{
    connectDB();
    console.log(`server is running ${PORT}`);
})
