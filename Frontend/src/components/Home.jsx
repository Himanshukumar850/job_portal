import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Home = () => {
    useGetAllJobs();
    const { user } = useSelector((state) => state.auth);

    if (user?.role === "recruiter") {
        return <Navigate to="/admin/jobs" replace />;
    }

    return (
        <div>
            <Navbar />
            <HeroSection />
            <CategoryCarousel />
            <LatestJobs />
            <Footer />
        </div>
    );
};

export default Home;