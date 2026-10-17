import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["student","recruiter"],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String},
        resumeOrignalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId,ref:'Company' },
        profilePicture:{type:String,default:""},
    }, 
    savedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        }
    ],
    resetPasswordOTP: {
        type: String,
        default: null,
    },
    resetPasswordOTPExpires: {
        type: Date,
        default: null,
    },
    resetPasswordAttempts: {
        type: Number,
        default: 0,
    },
},{timestamps:true});
const User = mongoose.model("User",userSchema);
export default User;