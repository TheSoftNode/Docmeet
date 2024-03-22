import Testimonial from "../../Components/Testimonial/testimonial";
import DoctorCard from "./../../Components/Doctors/DoctorCard";

import {BASE_URL} from "../../config";
import useFetchData from "./../../hooks/useFetchData"
import Loader from "../../Components/Loader/Loading";
import Error from "../../Components/Error/Error";
import { useEffect, useState } from "react";

const Doctors = () => {
    const [query, setQuery] = useState('');
    const [debounceQuery, setDebounceQuery] = useState("")


    const handleSearch = () => {
        setQuery(query.trim());
        console.log('handle search')
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounceQuery(query)
        }, 700)

        return () => clearTimeout(timeout)
    }, [query])

    let data;

    if (debounceQuery === ""){
        data = useFetchData(`${BASE_URL}/doctors`)
    }
    else {
        data = useFetchData(`${BASE_URL}/doctors?specialization=${debounceQuery}`);
    }

    const error = data.error;
    const loading = data.loading;
    const doctors = data.data;

    


  return (
    <>
        
        <section className="bg-[#fff9ea] py-7">
            <div className="container text-center py-3">
                <div className="heading text-[20px] leading-[30px]">Find a Doctor</div>
                    <div className="max-w-[570px] mt-[20px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between">
                        <input 
                        type="search"  
                        className="py-2 pl-2 pr-2 bg-transparent 
                        w-full focus:outline-none cursor-pointer placeholder:text-textColor"
                        placeholder="Search doctor by specialization"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        />
                        <button 
                            onClick={handleSearch}
                            className="btn mt-0 rounded-[0px] rounded-r-md">
                            Search
                        </button>
                    </div>
            </div>
        </section>

        <section className="">
            <div className="container">

                {!error && loading && <Loader />}
                {!loading &&error && <Error />}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-0">
                    {doctors?.data?.data?.map(doctor => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                </div>
                )}
                
            </div>
        </section>

        <section>
            <div className="container">
                <div className="xl: w-[470] mx-auto">
                    <h2 className="heading text-center">What our patients say</h2>
                    <p className="text_para text-center">
                        World-class care for everyone. Our health services offers unmatched expert health care.
                    </p>
                </div>
        
                <Testimonial />
            </div>
        </section>
    </>
  )
};

export default Doctors;