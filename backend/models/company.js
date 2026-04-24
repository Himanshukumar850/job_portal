import mongoose from "mongoose";

const companySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
    },

    website: {
        type: String,
    },

    location: {
        type: String,
        required: true
    },

    logo: {
        type: String, // image URL
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

}, { timestamps: true });

export default mongoose.model("Company", companySchema);