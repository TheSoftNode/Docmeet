import { AiFillDelete, AiFillEdit, AiOutlineEye} from 'react-icons/ai'
import { formatDate } from '../../utils/formatDate'
import { useContext, useEffect, useState} from 'react';
import { BASE_URL } from '../../config';
import useFetchData from '../../hooks/useFetchData';
import { authContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import ConfirmationDialog from '../../Components/Helpers/AccountConfirmation';

const Doctors = () => {
    const {data:doctors, loading:doctorsLoading, error:doctorsError} = useFetchData(`${BASE_URL}/doctors/all-doctors/admin`);
    const [doctorsData, setDoctorsData] = useState(null);
    const [deleteClickedIndex, setDeleteClickedIndex] = useState(null);
    const {user, token, dispatch} = useContext(authContext);
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
      setDoctorsData(doctors?.data?.data)
    }, [doctors])

    const deleteDoctorData = (index) => {
        if(user._id === index){
            dispatch({type: "LOGOUT"});
        }

        setDoctorsData(doctorsData.filter((doctor) => doctor?._id !== index ));
    }

    const handleDeleteProfile = (index) => {
       
        // setShowConfirmation(true);
        setDeleteClickedIndex(index);
        setShowOverlay(true);
    };

    const handleConfirmDeleteProfile = async (index) => {

        try{

            const res = await fetch(`${BASE_URL}/doctors/${index}`, {
                method: "DELETE",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })

            if(res.ok){
                deleteDoctorData(index);
                setDeleteClickedIndex(null);
                setShowOverlay(false);

            }
            else {
                setShowOverlay(false);
                setDeleteClickedIndex(null);
                toast.error(result.message);
            }
        }
        catch(err){
            setShowOverlay(true);
            setDeleteClickedIndex(null);
            console.log(err)
        }
    }

    const handleCancelDelete = () => {
        // setShowConfirmation(false);
        setDeleteClickedIndex(null);
        setShowOverlay(false);
    };

    
  return (
    <table className='w-full text-left text-sm text-gray-500'>
        <thead className='text-xs text-gray-700 uppercase '>
            <tr className='w-full mb-7'>
                <th colSpan="5" className='px-6 pb-5'>
                    <span className='!font-bold text-[20px]'>Total Doctors: </span>
                    <span
                        className={`!font-bold text-[20px] !text-teal-700 border-[2px] border-solid border-green-700 py-1 mx-3 px-3 rounded-full`}
                    >
                        {doctorsData?.length}
                    </span>
                </th>
            </tr>
            <tr className='bg-gray-50'>
                <th scope='col' className='px-6 py-3'>
                    Name
                </th>
                <th scope='col' className='px-6 py-3'>
                    Gender
                </th>
                <th scope='col' className={`${doctorsData?.map(item => item.isApproved !== "approved")[0] && "hidden"} px-6 py-3`}>
                    specialization
                </th>
                <th scope='col' className='px-6 py-3'>
                    Role
                </th>
                <th scope='col' className='px-6 py-3'>
                    Joined On
                </th>
                <th scope='col' className={`px-6 py-3`}>
                    Approval
                </th>
                <th scope='col' className='px-6 py-3' >
                    Actions
                </th>
            </tr>
        </thead>

        <tbody>
            {doctorsData?.map((item, index) => (
                <tr key={item._id} className='relative'>
                    <th scope='row' className='flex items-center px-6 py-4 text-gray-900 whitespace-nowrap'>
                        <img 
                            src={item.photo}
                            className='w-10 h-10 rounded-full'
                            alt=''
                        />
                        <div className="pl-3">
                            <div className='text-base font-semibold'>
                                {item.name}
                            </div>
                            <div className='text-normal text-gray-500'>
                                {item.email}
                            </div>
                        </div> 
                    </th>

                    <td className='px-7 py-4'>{item.gender}</td>
                    {item.isApproved === "approved" && (
                        <td className={`px-6 py-3`}>{item.specialization}</td> 
                    )}
                    {/* <td className={`${(item.isApproved !== "approved")[0] && "hidden"} px-6 py-3`}>{item.specialization}</td> */}
                    {/* <td className={`${doctorsData?.map(item => item.isApproved !== "approved")[0] && "hidden"} px-6 py-3`}>{item.specialization}</td> */}
                    <td className='px-6 py-4'>
                        {item.role.includes("admin") ? "admin" : item.role[0]}
                    </td>
                    <td className='px-6 py-4'>{formatDate(item.createdAt)}</td>
                    <td className={`px-6 py-4 `}>
                            {/* <button className={`${doctorsData?.map(item => item.isApproved === "approved")[0] ? "text-[#4148cb]" : "text-[#ff5151]" }`}> */}
                            <span className={`${(item.isApproved === "approved")? "text-[#4148cb]" : "text-[#ff5151]" }`}>
                               {item.isApproved}
                            </span>
                    </td>
                    <td className='flex items-center absolute top-5'>
                        <Link 
                            to={`/doctors/${item._id}`}
                            className='bg-none p-2 rounded-full
                            text-gray text-[18px] mr-5 ml-2 cursor-pointer mt-0 '
                        >
                            <AiOutlineEye fill='green'  />
                        </Link>
                        <button 
                            // onClick={() => deleteUserData(item?._id)}
                            onClick={() => handleDeleteProfile(index)}
                            className=' p-1 rounded-full
                            text-red text-[14px] cursor-pointer mt-0'
                        >
                            <AiFillDelete fill='red'/>
                        </button>
                           
                    </td>

                    {showOverlay && (<div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-[0.05] z-2 flex justify-center items-center `}></div>)}
                        {deleteClickedIndex === index  && (
                            <ConfirmationDialog
                                message="Are you sure you want to delete your account permanently?"
                                onConfirm={() => handleConfirmDeleteProfile(item._id)}
                                onCancel={handleCancelDelete}
                                title="Confirm Delete Account"
                                style="bg-white p-7 rounded-lg  shadow-lg absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            />
                                
                        )}
                </tr>
                 
            ))}
           
        </tbody>
    </table>
  )
}

export default Doctors