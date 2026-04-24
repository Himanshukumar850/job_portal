import Navbar  from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./CategoryCarousel "
import LatestJobs from "./LatestJobs"
import Footer from "./Footer"
import UseGetAllJobs from "@/Hooks/UseGetAllJobs";
import { useSelector } from "react-redux";
import store from "@/redux/store";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";


const Home = () =>{
    UseGetAllJobs();
    const {user} = useSelector(store =>store.auth);
    useEffect(() =>{
        if (user?.role === "recuiter"){
            Navigate("/admin/companies")
        }
    },[])
    
    return (
        <div>
            <Navbar/>
            <HeroSection />
            <CategoryCarousel />
            <LatestJobs/>
            <Footer/>
            


        </div>
    )
}
export default Home;