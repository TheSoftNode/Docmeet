import Testimonial from "../../Components/Testimonial/testimonial";
import DoctorCard from "./../../Components/Doctors/DoctorCard";
import {doctors} from "./../../assets/data/doctors";

const Doctors = () => {
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
                        placeholder="Search Doctor"
                        />
                        <button className="btn mt-0 rounded-[0px] rounded-r-md">
                            Search
                        </button>
                    </div>
            </div>
        </section>

        <section className="py-7">
            <div className="container">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-0">
                    {doctors.map(doctor => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                </div>
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