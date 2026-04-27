


import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { COMPANY_API_END_POINT } from '@/Utils/constant'
import { setCompanies } from '@/redux/CompanySlice';

function UseGetAllCompanies() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
                    withCredentials: true
                });

                
                if (res.data.success) {

                    dispatch(setCompanies(res.data.companies));
                } else {
                    console.warn(" Success is false");
                }
            } catch (error) {

                console.error("Full error:", error);
            }
        };

        fetchCompanies();

    }, []);  

    return null;  
}

export default UseGetAllCompanies