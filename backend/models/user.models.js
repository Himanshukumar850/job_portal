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
        type:Number,
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
        company:{type:mongoose.Schema.Types.ObjectId,ref:'company' },
        profilePicture:{type:String,default:""},
    }, 

},{timestamps:true});
const User = mongoose.model("User",userSchema);
export default User;