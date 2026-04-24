
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "@/redux/authslice";
import { toast } from "sonner";
import { USER_API_END_POINT } from "../Utils/constant";
import { Loader2 } from "lucide-react"; // Loading icon ke liye

const UpdateProfileDialog = ({ open, setopen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        bio: "",
        skills: "",
        file: null
    });

    useEffect(() => {
        if (user) {
            setInput({
                fullname: user.fullname || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                bio: user.profile?.bio || "",
                skills: user.profile?.skills?.join(", ") || "",
                file: null
            });
        }
    }, [user, open]); // open par bhi trigger hoga taaki data refresh ho

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        
        if (input.file) {
            formData.append("profile", input.file);
        }

        try {
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setopen(false); // Sirf success par band hoga
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setopen}>
            <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-xl p-6" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Update Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler} className="space-y-4 mt-4">
                    <div>
                        <Label>Full Name</Label>
                        <Input name="fullname" value={input.fullname} onChange={changeHandler} />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input type="email" name="email" value={input.email} onChange={changeHandler} />
                    </div>
                    <div>
                        <Label>Phone</Label>
                        <Input name="phoneNumber" value={input.phoneNumber} onChange={changeHandler} />
                    </div>
                    <div>
                        <Label>Bio</Label>
                        <Input name="bio" value={input.bio} onChange={changeHandler} />
                    </div>
                    <div>
                        <Label>Skills</Label>
                        <Input name="skills" value={input.skills} onChange={changeHandler} placeholder="React, Node, MongoDB" />
                    </div>
                    <div>
                        <Label>Resume (PDF)</Label>
                        <Input name="profile" type="file" accept="application/pdf" onChange={fileChangeHandler} />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-[#6A38C2] text-white hover:bg-[#5b30a6]">
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : "Update"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;