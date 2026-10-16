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
            const { applicationId, status, interviewDetails } = action.payload;
            if (Array.isArray(state.applicants)) {
                const applicant = state.applicants.find(
                    (item) => item._id === applicationId
                );
                if (applicant) {
                    applicant.status = status;
                    if (interviewDetails !== undefined) {
                        applicant.interviewDetails = interviewDetails;
                    }
                }
            }
        }
    }
});
export const {setAllApplicants, setApplicantStatus} = applicationSlice.actions;
export default applicationSlice.reducer;