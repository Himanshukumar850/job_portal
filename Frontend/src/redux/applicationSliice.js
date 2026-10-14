import { createSlice } from "@reduxjs/toolkit";
const applicationSlice = createSlice({
    name:'application',
    initialState:{
        applicants:[],
    },
    reducers:{
        setAllApplicants:(state, action) =>{
            state.applicants = action.payload;
        },
        setApplicantStatus:(state, action) =>{
            const applicant = state.applicants.find(
                (item) => item._id === action.payload.applicationId
            );
            if (applicant) {
                applicant.status = action.payload.status;
            }
        }
    }
});
export const {setAllApplicants, setApplicantStatus} = applicationSlice.actions;
export default applicationSlice.reducer;