import React, { useContext, useState} from 'react'
import {BiMenu} from "react-icons/bi"
import { authContext } from '../../context/AuthContext';
import {useNavigate} from "react-router-dom";
import { BASE_URL } from '../../config';

import {toast} from "react-toastify";

import HashLoader from "react-spinners/HashLoader"
import ConfirmationDialog from '../../Components/Helpers/AccountConfirmation';

const Tabs = ({tab, setTab}) => {

    const {token, dispatch} = useContext(authContext);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    // const [showSidebar, setShowSidebar] = useState(false);
    const navigate = useNavigate();
    

    const handleLogout = () => {
        dispatch({type: "LOGOUT"});
        navigate("/")
    }

    const handleDeleteProfile = () => {
        setShowConfirmation(true);
        setShowOverlay(true);
    };

    const handleConfirmDeleteProfile = async e => {
        setDeleteLoading(true);

        try{

            const res = await fetch(`${BASE_URL}/doctors/profile/delete-me`, {
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

    const [isOpen, setIsOpen] = useState(false);

    const openNav = () => {
        setIsOpen(true);
    };

    const closeNav = () => {
        setIsOpen(false);
    };

    
  return (
    <div>
        {/* <span className='lg:hidden' onClick={(e) => setShowSidebar(!showSidebar)} > */}
        <span className='lg:hidden' onClick={openNav} >
            <BiMenu className="w-6 h-6 cursor-pointer" />
        </span>

        <div 
            className={` ${isOpen ? "sidePanel" : "!hidden lg:!flex"} lg:flex flex-col p-[30px] max-w-[1024] bg-white shadow-panelShadow items-center h-max rounded-md`}
        >
            <span className="closeBtn hidden !text-black" onClick={closeNav}>&times;</span>
            <button 
                onClick={() => {setTab("overview"); closeNav()}}
                className={`${
                    tab === "overview"
                    ? "bg-indigo-100 text-primaryColor"
                    : "bg-transparent text-headingColor"
                } w-full  btn mt-2 rounded-md`}>
                Overview
            </button>

            <button 
                 onClick={() => {setTab("appointments"); closeNav()}}
                className={`${
                    tab === "appointments"
                    ? "bg-indigo-100 text-primaryColor"
                    : "bg-transparent text-headingColor"
                } w-full  btn mt-0 rounded-md`}>
                Appointments
            </button>

            <button 
                onClick={() => {setTab("settings"); closeNav()}}
                className={`${
                    tab === "settings"
                    ? "bg-indigo-100 text-primaryColor"
                    : "bg-transparent text-headingColor"
                } w-full  btn mt-0 rounded-md`}>
                Profile
            </button>

            <div className='mt-[100px] w-full '>
                <button 
                    onClick={handleLogout}
                    className='w-full  bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white'
                >
                    Logout
                </button>

                <button 
                    disabled={deleteLoading && true}
                    className='w-full bg-red-600  mt-4  p-3 text-[16px] leading-7 rounded-md text-white'
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
    </div>
  )
}

export default Tabs