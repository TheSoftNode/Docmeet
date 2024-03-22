import React, { useState } from "react";
import { useParams } from "react-router-dom";
import starIcon from "../../assets/images/Star.png";
import DoctorAbout from "./DoctorAbout";
import Feedback from "./Feedback";
import SidePanel from "./SidePanel";

import {BASE_URL} from "../../config";
import useFetchData from "./../../hooks/useFetchData"
import Loader from "../../Components/Loader/Loading";
import Error from "../../Components/Error/Error";

const DoctorDetail= () => {
    const [tab, setTab] = useState('about');
    const [profileKey, setProfileKey] = useState(Date.now()); 

    const {id} = useParams();

    const {
        data:doctor, 
        loading, 
        error
    } = useFetchData(`${BASE_URL}/doctors/${id}`, profileKey);

    const refreshProfile = () => {
        setProfileKey(prevKey => prevKey + 1); // Update the key to force a refresh
    }; 


  return (
    <section>
        <div className="max-w-[1170px] px-5 mx-auto">

            {loading && <Loader />}
            {error && <Error />}
            {!loading && !error && (
                <div className="grid md:grid-cols-3 gap-[50px]">

                    <div className="md:col-span-2">
                        <div className="flex items-center gap-5">
                            <figure>
                                <img src={doctor?.data?.data?.photo} alt=""  className="w-full"/>
                            </figure>

                            <div>
                                <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded">
                                    {doctor?.data?.data?.specialization}
                                </span>
                                <h3 className="text-headingColor text-[22px] leading-9 mt-3 font-bold">
                                    {doctor?.data?.data?.name}
                                </h3>
                                <div className="flex items-center gap-[6px]">
                                    <span className="flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold text-headingColor">
                                        <img src={starIcon} alt="" /> 
                                        {doctor?.data?.data?.averageRating}
                                    </span>
                                    <span className="text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-[400] text-textColor">
                                        ({doctor?.data?.data?.totalRating})
                                    </span>
                                </div>

                                <p className="text_para text-[14px] leading-6 md:text-[15px] lg:max-w-[390px]">
                                    {doctor?.data?.data?.bio}
                                </p>
                            </div>
                        </div>

                        <div className="mt-[50px] border-b border-solid border-[#0066ff34]">
                            <button 
                            onClick={() => setTab("about")}
                            className={`${tab === "about" && "border-b border-solid border-primaryColor"} py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
                            >
                                About
                            </button>

                            <button 
                            onClick={() => setTab("feedback")}
                            className={`${tab === "feedback" && "border-b border-solid border-primaryColor"} py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
                            >
                                Feedback
                            </button>
                        </div>

                        <div className="mt-[50px]">
                            { 
                                tab === "about" && ( 
                                    <DoctorAbout  
                                        doctor={doctor?.data?.data} 
                                    />
                                )
                            }
                            {
                                tab === "feedback" && (
                                    <Feedback 
                                        reviews={doctor?.data?.data?.reviews} 
                                        totalRating={doctor?.data?.data?.totalRating} 
                                        refreshProfile={refreshProfile} 
                                    />
                                )
                            }
                        </div>
                    </div>
                    
                    <div>
                        <SidePanel
                            doctorId={doctor?.data?.data?._id}
                            ticketPrice={doctor?.data?.data?.ticketPrice}
                            timeSlots={doctor?.data?.data?.timeSlots}
                        />
                    </div>
                </div>
            )}
        </div>
    </section>
  )
};

export default DoctorDetail;