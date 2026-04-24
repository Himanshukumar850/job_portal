import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { JOB_API_END_POINT } from "@/Utils/constant";

function AdminJobsEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState({
        title: "",
        description: "",
        salary: "",
        location: "",
        jobType: "",
        experienceLevel: "",
        position: "",
    });

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(
                    `${JOB_API_END_POINT}/get/${id}`,
                    { withCredentials: true }
                );

                console.log("JOB DATA:", res.data);

                const data = res.data.job;

                // 🔥 Safe mapping
                setJob({
                    title: data?.title || "",
                    description: data?.description || "",
                    salary: data?.salary || "",
                    location: data?.location || "",
                    jobType: data?.jobType || "",
                    experienceLevel: data?.experienceLevel || "",
                    position: data?.position || "",
                });

            } catch (error) {
                console.log(error);
            }
        };

        fetchJob();
    }, [id]);


    const changeHandler = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.put(
                `${JOB_API_END_POINT}/update/${id}`,
                job,
                { withCredentials: true }
            );

            // 🔥 redirect after update
            navigate("/admin/jobs");

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />

            <div className="max-w-3xl mx-auto my-10 bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-5">Edit Job</h1>

                <form onSubmit={submitHandler} className="space-y-4">

                    <input
                        type="text"
                        name="title"
                        value={job.title || ""}
                        onChange={changeHandler}
                        placeholder="Job Title"
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="description"
                        value={job.description || ""}
                        onChange={changeHandler}
                        placeholder="Description"
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="number"
                        name="salary"
                        value={job.salary || ""}
                        onChange={changeHandler}
                        placeholder="Salary"
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="location"
                        value={job.location || ""}
                        onChange={changeHandler}
                        placeholder="Location"
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="jobType"
                        value={job.jobType || ""}
                        onChange={changeHandler}
                        placeholder="Job Type"
                        className="w-full border p-2 rounded"
                    />


                    <input
                        type="text"
                        name="experienceLevel"
                        value={job.experienceLevel || ""}
                        onChange={changeHandler}
                        placeholder="Experience"
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="number"
                        name="position"
                        value={job.position || ""}
                        onChange={changeHandler}
                        placeholder="Positions"
                        className="w-full border p-2 rounded"
                    />

                    <button
                        disabled={loading}
                        className="bg-black text-white px-4 py-2 rounded w-full"
                    >
                        {loading ? "Updating..." : "Update Job"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default AdminJobsEdit;