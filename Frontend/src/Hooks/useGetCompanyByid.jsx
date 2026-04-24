


import axios from 'axios'
import  { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { COMPANY_API_END_POINT } from '@/Utils/constant'
import { setSingleCompany } from '@/redux/CompanySlice';

function UseGetCompanyByid (companyId) {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchSingleCompany = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, {
                    withCredentials: true
                });
                
                
                if (res.data.success) {
                    
                    dispatch(setSingleCompany(res.data.company));
                } else {
                    console.warn(" Success is false");
                }
            } catch (error) {
                
                console.error("Full error:", error);
            }
        };
        
        fetchSingleCompany();
        
    }, [companyId, dispatch]);  
    
    return null;  
}

export default UseGetCompanyByid