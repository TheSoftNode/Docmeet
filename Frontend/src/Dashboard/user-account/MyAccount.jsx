import React, {useContext, useEffect, useState} from 'react';
import { authContext } from '../../context/AuthContext';

import useGetProfile from "../../hooks/useFetchData"
import { BASE_URL} from '../../config';
import {toast} from "react-toastify";

import MyBookings from './MyBookings';
import Profile from './Profile';
import Loading from '../../Components/Loader/Loading';
import Error from '../../Components/Error/Error';
import HashLoader from "react-spinners/HashLoader"
import ConfirmationDialog from '../../Components/Helpers/AccountConfirmation';
import { Link } from 'react-router-dom';

const MyAccount = () => {

    const {token, dispatch} = useContext(authContext);
    const [tab, setTab] = useState("bookings")
    const [profileKey, setProfileKey] = useState(Date.now()); // Key to trigger refetch
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    const {data:userData, loading, error} = useGetProfile(`${BASE_URL}/users/profile/me`, profileKey);

    const handleLogout = () => {
        dispatch({type: "LOGOUT"})
    }

    const handleDeleteProfile = () => {
        setShowConfirmation(true);
        setShowOverlay(true);
    };

    const handleConfirmDeleteProfile = async e => {
        setDeleteLoading(true);

        try{

            const res = await fetch(`${BASE_URL}/users/profile/delete-me`, {
                method: "DELETE",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })

            if(res.ok){
                setDeleteLoading(false);
                setShowOverlay(false);
                dispatch({type: "LOGOUT"});
            }
            else {
                setShowOverlay(false);
                toast.error(result.message);
                setDeleteLoading(false);
            }
        }
        catch(err){
           
            console.log(err)

            setShowOverlay(true);
            setDeleteLoading(false)
        }
    }

    const handleCancelDelete = () => {
        setShowConfirmation(false);
        setShowOverlay(false);
    };

    const refreshProfile = () => {
        setProfileKey(prevKey => prevKey + 1); // Update the key to force a refresh
    };

  return (
    <section>
        <div className='max-w-[1170px] px-6 mx-auto lg:max-w-[1200px]'>

            {loading && !error && <Loading />}

            {error && !loading && <Error errMessage={error} />}

            {
                !loading && !error && (
            <div className="grid md:grid-cols-3 gap-10">

                <div className='pb-[50px] px-[30px] rounded-md '>
                    <div className='flex items-center justify-center'>

                        <figure className='w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor' >
                            <img 
                                src={userData?.data?.data?.photo} 
                                alt="" 
                                className='w-full h-full rounded-full'
                            />
                        </figure>
                    </div>

                    <div className='text-center mt-4'>
                        <h3 className='text-[18px] leading-[30px] text-headingColor font-bold'>
                            {userData?.data?.data?.name}
                        </h3>
                        <p className='text-textColor text-[15px] leading-6 font-medium'>
                            {userData?.data?.data?.email}
                        </p>
                        <p className='text-textColor text-[15px] leading-6 font-medium'>
                            Blood Type:
                            <span className='ml-2 text-headingColor text-[22px] leading-8'>
                            {userData?.data?.data?.bloodType}
                            </span>
                        </p>
                    </div>

                    <div className='mt-[50px] md:mt-[100px] flex flex-col items-center justify-center'>
                        {userData?.data?.data?.role?.includes("admin") && (
                            <button 
                                className='md:w-full sm:w-[500px] w-full bg-[#2c2584] p-3 text-[16px] leading-7 rounded-md text-white'
                            >
                                <Link to="/admin/dashboard">
                                    Go to Dashboard
                                </Link>
                            </button>
                        )}
                        

                        <button 
                                onClick={handleLogout}
                                className='md:w-full sm:w-[500px] mt-4 w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white'
                            >
                                Logout
                        </button>

                        <button 
                                disabled={deleteLoading && true}
                                className='md:w-full sm:w-[500px] w-full bg-red-600  mt-4 p-3 text-[16px] leading-7 rounded-md text-white'
                                onClick={handleDeleteProfile}
                            >
                                { deleteLoading ? <HashLoader size={35} color="#ffffff" /> :  "Delete Account"}
                        </button>
                        {showOverlay && (<div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-2 flex justify-center items-center `}></div>)}
                            {showConfirmation && (
                                <ConfirmationDialog
                                    message="Are you sure you want to delete your account permanently?"
                                    onConfirm={handleConfirmDeleteProfile}
                                    onCancel={handleCancelDelete}
                                    title="Confirm Delete Account"
                                />
                            )}
                    </div>
                </div>

                <div className='md:col-span-2  md:px-[30px]'>
                    <div className='flex items-center justify-center sm:flex-row flex-col'>
                        <button 
                            onClick={() => setTab('bookings')}
                            className={ `${
                                tab==="bookings" && "bg-primaryColor text-white font-normal"
                            } p-2 mr-5 px-5 mb-3 w-[10rem] sm:mb-0 rounded-md text-headingColor 
                            font-semibold text-[16px] leading-7 border border-solid
                            border-primaryColor`}
                        >
                            My Bookings
                        </button>

                        <button 
                            onClick={() => setTab('settings')}
                            className={ `${
                                tab==="settings" && "bg-primaryColor text-white font-normal"
                            } p-2 mr-5 px-5 w-[10rem] rounded-md text-headingColor 
                            font-semibold text-[16px] leading-7 border border-solid
                            border-primaryColor`}
                        >
                            Profile Settings
                        </button>
                    </div>

                    {tab === "bookings" && <MyBookings />}
                    {tab === "settings" && <Profile  user={userData} refreshProfile={refreshProfile} />}
                </div>
            </div>
                )
            }

        </div>
    </section>
  )
}

export default MyAccount