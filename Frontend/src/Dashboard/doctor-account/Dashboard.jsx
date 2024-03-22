import React, { useContext, useState } from 'react';
import Loader from "../../Components/Loader/Loading";
import Error from "../../Components/Error/Error";
import useGetProfile  from "../../hooks/useFetchData";
import { BASE_URL} from '../../config';
import { authContext } from '../../context/AuthContext';
import Tabs from './Tabs';
import starIcon from "../../assets/images/Star.png";
import DoctorAbout from "../../Pages/Doctors/DoctorAbout";
import Profile from './Profile';
import Appointments from './Appointments';
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

const Dashboard = () => {
    const {data:doctorData, loading, error} = useGetProfile(`${BASE_URL}/doctors/profile/me`)
    const [approvalLoading, setApprovalLoading] = useState(false);
    const [requestError, setRequestError ]= useState(null)
    const navigate = useNavigate()
    const {token} = useContext(authContext)

    console.log(doctorData)

    const requestApproval = async() => {
        try {
            setApprovalLoading(true)
            const res = await fetch(`${BASE_URL}/doctors/doctor-approval-request`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })
    
            const result = await res.json();
    
            if(res.ok){
                navigate("/doctors/profile/me")
                toast.success(result.message);
                setApprovalLoading(false)
            }
            else {
                setRequestError(result.message)
                setApprovalLoading(false)
                toast.error(result.message);
            }
        } catch (error) {
            console.log(error)
            setApprovalLoading(false)
        }
        
    }

    const [tab, setTab] = useState("overview")
  return (
    <section className='pt-6'>
        <div className='max-w-[1170px] px-5 mx-auto'>
            {loading && !error && <Loader />}
            {error && !loading && <Error /> }

            {!loading && !error && (
                <div className='grid lg:grid-cols-3 gap-[30px] lg:gap-[50px]'>
                    <Tabs tab={tab} setTab={setTab}/>
                    <div className='lg:col-span-2'>
                        {
                            doctorData?.data?.data?.isApproved === "pending" && (
                                <div className='flex p-4 mb-4 text-yellow-800 justify-center bg-yellow-50 rounded-lg'>
                                    <svg
                                        aria-hidden="true"
                                        className="flex-shrink-0 w-5 h-5 sm:mt-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www/w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 
                                            012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>

                                    <span className='sr-only'>Info</span>
                                    <div className='ml-3 text-sm font-medium flex flex-col md:flex-row'>
                                        <p className='mb-3 md:mt-2 md:mb-0'>To get approval, please complete your profile and</p>
                                        <span 
                                            onClick={requestApproval}
                                            className='border border-solid md:ml-3 mr-3 
                                            text-center align-middle mb-3 md:mb-0 p-2 rounded-lg text-green-600
                                            w-[10rem] cursor-pointer'
                                        >
                                            {approvalLoading ? <HashLoader size={20} color='green' className='absolute' /> : "Request approval"}  
                                        </span>
                                        <p className='mb-3 sm:mt-2 sm:mb-0'>We'd approve in 48 hours</p>
                                    </div>
                                </div>
                            )
                        }

{
                            doctorData?.data?.data?.isApproved === "revoked" && (
                                <div className='flex p-4 mb-4 text-yellow-800 justify-center bg-yellow-50 rounded-lg'>
                                    <svg
                                        aria-hidden="true"
                                        className="flex-shrink-0 w-5 h-5 sm:mt-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www/w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 
                                            012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>

                                    <span className='sr-only'>Info</span>
                                    <div className='ml-3 text-sm font-medium flex flex-col md:flex-row'>
                                        <p className='mb-3 md:mt-2 md:mb-0'>
                                            Your doctor status was revoked by admin. Please find out why and
                                        </p>
                                        <span 
                                            onClick={requestApproval}
                                            className='border border-solid md:ml-3 mr-3 
                                            text-center align-middle mb-3 md:mb-0 p-2 rounded-lg text-green-600
                                            w-[10rem] cursor-pointer'
                                        >
                                            {approvalLoading ? <HashLoader size={20} color='green' className='absolute' /> : "Request approval"}  
                                        </span>
                                        <p className='mb-3 sm:mt-2 sm:mb-0'>again if necessary</p>
                                    </div>
                                </div>
                            )
                        }

                        <div className='mt-8'>

                            {tab === "overview" && (<div>
                                    <div className='flex items-center gap-4 mb-10'>
                                        <figure className='max-w-[200px] max-h-[200px]'>
                                            <img src={doctorData?.data?.data?.photo} alt="" className='max-w-[200px] w-[200px] h-[200px] max-h-[200px]' />
                                        </figure>

                                        <div>
                                            <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-4 lg:py-2 
                                            lg:px-6 rounded text-[12px] leading-4 lg:text-[16px] lg:leading-6 font-semibold'>
                                                {doctorData?.data?.data?.specialization}
                                            </span>

                                            <h3 className='text-[22px] leading-9 font-bold text-headingColor mt-3'>
                                                {doctorData?.data?.data?.name}
                                            </h3>

                                            <div className='flex items-center gap-[6px]'>
                                                <span className='flex items-center gap-[6px] text-headingColor text-[14px]
                                                    leading-5 lg:text-[16px] lg:leading-6 font-semibold'
                                                >
                                                    <img src={starIcon} alt="" />
                                                    {doctorData?.data?.data?.averageRating}
                                                </span>

                                                <span className=' text-textColor text-[14px]
                                                    leading-5 lg:text-[16px] lg:leading-6 font-semibold'
                                                >
                                                    ({doctorData?.data?.data?.totalRating})
                                                </span>
                                            </div>

                                            <p className='text_para font-[15px] lg:max-w-[390px] leading-6'>
                                                {doctorData?.data?.data?.bio}
                                            </p>
                                        </div>
                                    </div>
                                    <DoctorAbout 
                                        // name={doctorData?.data?.data?.name}  
                                        // about={doctorData?.data?.data?.about}
                                        // qualifications={doctorData?.data?.data?.qualifications}
                                        // experiences={doctorData?.data?.data?.experiences}
                                        doctor={doctorData?.data?.data}
                                    />
                                </div>)}
                            {tab === "appointments" && <Appointments appointments={doctorData?.data?.data?.appointments} />}
                            {tab === "settings" && <Profile doctor={doctorData} />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </section>
  )
}

export default Dashboard