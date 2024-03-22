import { AiFillDelete, AiFillEdit, AiOutlineEye} from 'react-icons/ai'
import { formatDate } from '../../utils/formatDate'
import { useContext, useEffect, useState} from 'react';
import { BASE_URL } from '../../config';
import { authContext } from '../../context/AuthContext';
import useFetchData from '../../hooks/useFetchData';
import { Link, useNavigate } from 'react-router-dom';
import NotificationView from '../../Components/Helpers/NotificationView';
import {toast} from "react-toastify";

const Notifications = () => {
    const {data:notifications, loading, error} = useFetchData(`${BASE_URL}/notifications`);
    const [notificationsData, setNotificationsData] = useState(null);

    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [hoveredTitleIndex, setHoveredTitleIndex] = useState(null);
    const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null);

    const handleHoverEnter = (index) => {
        setHoveredIndex(index);
    };

    const handleHoverLeave = () => {
        setHoveredIndex(null);
    };

    const handleHoverTitleEnter = (index) => {
        setHoveredTitleIndex(index);
    };

    const handleHoverTitleLeave = () => {
        setHoveredTitleIndex(null);
    };

    const handleHoverMessageEnter = (index) => {
        setHoveredMessageIndex(index);
    };

    const handleHoverMessageLeave = () => {
        setHoveredMessageIndex(null);
    };

    // const [hovering, setHovering] = useState(false);
    // const [hoveringTitle, setHoveringTitle] = useState(false);
    // const [hoveringMessage, setHoveringMessage] = useState(false);
    const {token} = useContext(authContext);
    const navigate = useNavigate();

    useEffect(() => {
      setNotificationsData(notifications?.data?.data)
    }, [notifications])

    const deleteItem = (id) => {
        setNotificationsData(notifications => notifications.filter((notification) => notification._id !== id));
    }

    const handleDeleteNotification = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/notifications/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })

            if(res.ok){
                deleteItem(id);
                toast.success("Notification deleted!")
            }
            else {
                toast.error(result.message);
                console.log(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleCheckNotification = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/notifications/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })

            const result = await res.json()

            if(!res.ok){
                toast.error(result.message);
                console.log(result.message);
            }

                

        } catch (error) {
            console.log(error);
        }
    }

    
  return (
    <table className='w-full text-left text-sm text-gray-500'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
        <tr className='w-full mb-7'>
                <th colSpan="5" className='px-6 pb-5'>
                    <span className='!font-bold text-[20px]'>Total Notifications: </span>
                    <span
                        className={`!font-bold text-[20px] !text-teal-700 border-[2px] border-solid border-green-700 py-1 mx-3 px-3 rounded-full`}
                    >
                        {notificationsData?.length}
                    </span>
                </th>
            </tr>
            <tr>
                <th scope='col' className='px-6 py-3'>
                    Name
                </th>
                <th scope='col' className='px-6 py-3'>
                    Type
                </th>
                <th scope='col' className={` px-6 py-3`}>
                    Title
                </th>
                <th scope='col' className='px-6 py-3'>
                    Message
                </th>
                <th scope='col' className='px-6 py-3'>
                    status
                </th>
                <th scope='col' className={`px-6 py-3`}>
                    Created At
                </th>
                <th scope='col' className='px-6 py-3' >
                    Actions
                </th>
            </tr>
        </thead>

        <tbody>
        {notificationsData?.map((item, index) => (
    <tr key={item._id} className={`${item.status === "unread" && "!bg-green-200"} relative`}>
        <th scope='row' className='flex items-center px-6 py-4 text-gray-900 whitespace-nowrap'>
            <img 
                src={item.user ? item.user?.photo : item.doctor?.photo}
                className='w-10 h-10 rounded-full'
                alt=''
            />
            <div className="pl-3">
                <div className='text-base font-semibold'>
                    {item.user ? item.user?.name : item.doctor?.name}
                </div>
                <div className='text-normal text-gray-500'>
                    {item.email}
                </div>
            </div> 
        </th>

        <td 
            onMouseEnter={() => handleHoverEnter(index)} 
            onMouseLeave={() => handleHoverLeave(index)} 
            className='px-7 py-4 cursor-pointer relative'
        >
            {item.notificationType.slice(0, 7)}...
            {hoveredIndex === index && <NotificationView title="Notification Type" value={item.notificationType} />}
        </td>
        
        <td 
            onMouseEnter={() => handleHoverTitleEnter(index)} 
            onMouseLeave={() => handleHoverTitleLeave(index)} 
            className="px-7 py-4 cursor-pointer relative"
        >
            {item.title.slice(0, 7)}...
            {hoveredTitleIndex === index && <NotificationView title="Notification Title" value={item.title} />}
        </td>

        <td 
            onMouseEnter={() => handleHoverMessageEnter(index)} 
            onMouseLeave={() => handleHoverMessageLeave(index)} 
            className="px-7 py-4 cursor-pointer relative text-ellipsis"
        >
            {item.message.slice(0, 7)}...
            {hoveredMessageIndex === index && <NotificationView title="Message" value={item.message} />}
        </td>
        <td className="px-6 py-4">{item.status === "unread" ? "unchecked" : "checked"}</td>
        <td className='px-6 py-4'>{formatDate(item.createdAt)}</td>
        <td className='flex items-center absolute top-5'>
            <button
                className='bg-none p-2 rounded-full
                text-gray text-[18px] mr-5 ml-2 cursor-pointer mt-0 '
                onClick={() => handleCheckNotification(item._id)}
            >
                <Link 
                    // to={`${item.user ? `/users/${item.user?._id}` : `/doctors/${item.doctor?._id}`}`}
                    to={
                        `${
                            item.doctor?._id ? `/doctors/${item.doctor?._id}` : ``
                            ?? item.user?._id ? `/users/${item.user?._id}` : ``
                        }`
                    }
                >
                    <AiOutlineEye fill='green'  />
                </Link>
            </button>
            
            <button 
                onClick={() => handleDeleteNotification(item._id)}
                className=' p-1 rounded-full
                text-red text-[14px] cursor-pointer mt-0'
            >
                <AiFillDelete fill='red' />
            </button>
        </td>
    </tr>
))}

            {/* {notificationsData?.map(item => (
                <tr key={item._id} className={`${item.status === "unread" && "!bg-green-200"} relative`}>
                    <th scope='row' className='flex items-center px-6 py-4 text-gray-900 whitespace-nowrap'>
                        <img 
                            src={item.user? item.user.photo : item.doctor.photo}
                            className='w-10 h-10 rounded-full'
                            alt=''
                        />
                        <div className="pl-3">
                            <div className='text-base font-semibold'>
                                {item.user? item.user.name : item.doctor.name}
                            </div>
                            <div className='text-normal text-gray-500'>
                                {item.email}
                            </div>
                        </div> 
                    </th>

                    <td 
                        onMouseEnter={() => setHovering(true)} 
                        onMouseLeave={() => setHovering(false)} 
                        className='px-7 py-4 cursor-pointer relative'
                    >
                        {item.notificationType.slice(0, 7)}...
                        {hovering && <NotificationView title="Notification Type" value={item.notificationType} />}
                    </td>
                    
                    <td 
                        onMouseEnter={() => setHoveringTitle(true)} 
                        onMouseLeave={() => setHoveringTitle(false)} 
                        className="px-7 py-4 cursor-pointer relative"
                    >
                        {item.title.slice(0, 7)}...
                        {hoveringTitle && <NotificationView title="Notification Title" value={item.title} />}
                    </td>

                    <td 
                        onMouseEnter={() => setHoveringMessage(true)} 
                        onMouseLeave={() => setHoveringMessage(false)} 
                        className="px-7 py-4 cursor-pointer relative text-ellipsis"
                    >
                        {item.message.slice(0, 7)}...
                        {hoveringMessage && <NotificationView title="Message" value={item.message} />}
                    </td>
                    <td className="px-6 py-4">{item.status === "unread" ? "unchecked" : "checked"}</td>
                    <td className='px-6 py-4'>{formatDate(item.createdAt)}</td>
                    <td className='flex items-center absolute top-5'>
                        <button
                            className='bg-none p-2 rounded-full
                            text-gray text-[18px] mr-5 ml-2 cursor-pointer mt-0 '
                            onClick={() => handleCheckNotification(item._id)}
                        >
                            <Link 
                                to={`${ item.user? `/users/${item.user._id}` : `/doctors/${item.doctor._id}`}`}
                            >
                                <AiOutlineEye fill='green'  />
                            </Link>
                        </button>
                        
                        <button 
                            onClick={() => handleDeleteNotification(item._id)}
                            className=' p-1 rounded-full
                            text-red text-[14px] cursor-pointer mt-0'
                        >
                            <AiFillDelete fill='red' />
                        </button>

                    </td>
                </tr>
                 
            ))} */}
           
        </tbody>
    </table>
  )
}

export default Notifications