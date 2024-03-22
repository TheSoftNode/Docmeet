import { formatDate } from '../../utils/formatDate';
import {authContext } from '../../context/AuthContext';
import { useContext, useState } from 'react';
import ConfirmationDialog from '../../Components/Helpers/AccountConfirmation';
import { BASE_URL} from '../../config';
import {toast} from "react-toastify";
import HashLoader from "react-spinners/HashLoader"
import {useParams, useNavigate} from "react-router-dom"
import ActionReason from '../../Components/Helpers/ActionReason';

const DoctorAbout = ({ doctor}) => {

    const {id} = useParams();
    const navigate = useNavigate();

    const {user, token} = useContext(authContext);
    const [approveLoading, setApproveLoading] = useState(false)
    const [revokeLoading, setRevokeLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showReasonConfirmation, setShowReasonConfirmation] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showActionReasonOverlay, setShowActionReasonOverlay] = useState(false);
    const [actionReason, setActionReason] = useState('');


    const handleActionReason = (value) => {
        // Do something with the value received from the child component
        setActionReason(prevValue => { return value});
    };

    const handleDeleteProfile = () => {
        setReason(actionReason)
        setShowConfirmation(true);
        setShowOverlay(true);
    };

    const handleRevoked = () => {
        console.log(actionReason)
        setShowReasonConfirmation(true);
        setShowActionReasonOverlay(true);
    };


    const handleConfirmDeleteProfile = async e => {
        setDeleteLoading(true);

        try{

            const res = await fetch(`${BASE_URL}/doctors/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })

            // const result = await res.json();

            if(res.ok){
                setDeleteLoading(false);
                setShowOverlay(false);
                setShowConfirmation(false);
                navigate("/doctors/profile/me")
            }
            else {
                setShowOverlay(false);
                // toast.error(result.message);
                setDeleteLoading(false);
                setShowConfirmation(false);
                navigate("/doctors/profile/me")
            }
        }
        catch(err){
           
            console.log(err)

            setShowOverlay(true);
            setDeleteLoading(false)
            setShowConfirmation(false);
        }
    }

    const handleCancelDelete = () => {
        setShowConfirmation(false);
        setShowOverlay(false);
    };

    const handleCancelRevoked = () => {
        setShowReasonConfirmation(false);
        setShowActionReasonOverlay(false);
    };

    const handleApproveDoctor = async () => {
        setApproveLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/doctors/approve/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })
    
            const result = await res.json();
            console.log(result);
    
            if(res.ok){
                setApproveLoading(false)
                toast.success("You just approved a doctor")
            }
            else {
                setApproveLoading(false);
                toast.error(result.message)
                console.log(result.message)
            }
        } catch (error) {
            setApproveLoading(false);
            console.log(error);
        }
        
    }

    const handleRevokeApproval = async () => {
        setRevokeLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/doctors/revoke/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({actionReason})
            })

            console.log(actionReason)
    
            const result = await res.json();
    
            if(res.ok){
                setRevokeLoading(false)
                setShowActionReasonOverlay(false)
                setShowReasonConfirmation(false)
                toast.success("You revoked a doctor's approval")
            }
            else {
                setRevokeLoading(false);
                setShowActionReasonOverlay(false)
                setShowReasonConfirmation(false)
                toast.error(result.message)
                console.log(result.message)
            }
        } catch (error) {
            setRevokeLoading(false);
            setShowActionReasonOverlay(false)
            setShowReasonConfirmation(false)
            console.log(error);
        }
        
    }


  return (
    <div>
        <div>
            <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold flex items-center gap-2">
                About of
                <span className="text-irisBlueColor font-bold text-[24px] leading-9">
                   {doctor?.name}
                </span>
            </h3>
            <p className="text_para">
                {doctor?.about}
            </p>
        </div>

        <div className="mt-12">
            <h3  className='text-[20px] leading-[30px] text-headingColor font-semibold'>
                Education
            </h3>

            <ul className='pt-4 md:p-5'>

                {doctor?.qualifications?.map((item, index) => (
                     <li key={index} className='flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]'>
                     <div>
                         <span className='text-irisBlueColor text-[15px] leading-6 font-semibold'>
                         {formatDate(item.startingDate)} - {formatDate(item.endingDate)}
                         </span>
                         <p className='text-[16px] leading-6 font-medium text-textColor'>
                            {item.degree}
                         </p>
                     </div>
                     <p className='text-[14px] leading-5 font-medium text-textColor'>
                         {item.university}
                     </p>
                 </li>
                ))}

            </ul>
        </div>

        <div className="mt-12">
            <h3  className='text-[20px] leading-[30px] text-headingColor font-semibold'>
                Experience
            </h3>

            <ul className='grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5'>

                {doctor?.experiences?.map((item, index) => (
                    <li key={index} className='p-4 rounded bg-[#fff9ea]'>
                        <span className='text-yellowColor text-[16px] leading-6 font-semibold'>
                            {formatDate(item.startingDate)} - {formatDate(item.endingDate)} 
                        </span>
                        <p className='text-[15px] leading-6 font-medium text-textColor'>
                            {item.position}
                        </p>
                        
                        <p className='text-[14px] leading-5 font-medium text-textColor'>
                            {item.hospital}
                        </p>
                    </li>
                ))}
            </ul>
        </div>

        {user?.role?.includes("admin") && (
            <div className="mt-7 sm:flex w-full justify-center">
                {doctor?.isApproved !== "approved" 
                    ? (
                        <button
                            disabled={(approveLoading) && true}
                            onClick={handleApproveDoctor}
                            type="submit"
                            className="sm:w-[30%]  sm:ml-5  bg-primaryColor  mt-4 px-4 py-3 text-[16px] leading-7 rounded-md text-white"
                        >
                            {/* { loading ? <RotateLoader size={35} color="#ffffff" /> :  "Login"} */}
                            { approveLoading ? <HashLoader size={35} color="#ffffff" /> :  "Approve Doctor"}
                    </button>
                    ) 
                    : (
                        <button
                            disabled={revokeLoading && true}
                            onClick={handleRevoked}
                            type="submit"
                            className="sm:w-[30%]  sm:ml-5  w-full bg-black  mt-4 px-4 py-3 text-[16px] leading-7 rounded-md text-white"
                        >
                            { revokeLoading ? <HashLoader size={35} color="#ffffff" /> :  "Revoke Approval"}
                        </button>
                    )
                }

                {showActionReasonOverlay && (<div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-10 z-2 flex justify-center items-center `}></div>)}
                    {showReasonConfirmation && (
                        <ActionReason
                            onConfirm={handleRevokeApproval}
                            onCancel={handleCancelRevoked}
                            title="Why Revoke This Account?"
                            onSendReason={handleActionReason}
                        />
                    )}
                
                <button 
                    disabled={deleteLoading && true}
                    className='sm:w-[30%]  sm:ml-5  w-full bg-red-600  mt-4 px-4 py-3 text-[16px] leading-7 rounded-md text-white'
                    onClick={handleDeleteProfile}
                >
                    { deleteLoading ? <HashLoader size={35} color="#ffffff" /> :  "Delete Doctor"}
                </button>
                    {showOverlay && (<div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-2 flex justify-center items-center `}></div>)}
                        {showConfirmation && (
                            <ConfirmationDialog
                                message="Are you sure you want to delete this  account permanently?"
                                onConfirm={handleConfirmDeleteProfile}
                                onCancel={handleCancelDelete}
                                title="Confirm Delete Account"
                            />
                    )}
            </div>
        )}
       
    </div>
    
  )
}

export default DoctorAbout