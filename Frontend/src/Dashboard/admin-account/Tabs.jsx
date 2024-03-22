import { useContext, useState } from "react"
import { authContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi";

const Tabs = ({tab, setTab, totalDoctors, totalNotifications}) => {
    if(totalDoctors < 1){
        totalDoctors = 0
    }

    const {user} = useContext(authContext);

    const [isOpen, setIsOpen] = useState(false);

    const openNav = () => {
        setIsOpen(true);
    };

    const closeNav = () => {
        setIsOpen(false);
    };

  return (
    <div>
        <span className='lg:hidden' onClick={openNav} >
            <BiMenu className="w-6 h-6 cursor-pointer" />
        </span>
        <div 
            className={`${isOpen ? "sidePanel" : "!hidden lg:!flex"} lg:flex flex-col p-[20px] max-w-[1024] bg-white shadow-panelShadow items-center h-max rounded-md`}
        >
            <span className="closeBtn hidden" onClick={closeNav}>&times;</span>
            <button 
                onClick={() => {setTab("users"); closeNav()}}
                className={`${
                    tab === "users"
                    ? "bg-indigo-100 text-primaryColor"
                    : "bg-transparent text-headingColor"
                } w-full text-start btn mt-2 rounded-md border border-solid`}>
                Users
            </button>

            <button 
                onClick={() => {setTab("doctors"); closeNav()}}
                className={`${
                    tab === "doctors"
                    ? "bg-indigo-100 text-primaryColor"
                    : "bg-transparent text-headingColor"
                } w-full text-start btn mt-3 rounded-md border border-solid relative`}>
                Doctors
            </button>

            <button 
                 onClick={() => {setTab("awaitingApproval"); closeNav()}}
                className={`${
                    tab === "awaitingApproval"
                    ? "bg-indigo-100 text-primaryColor"
                    : "bg-transparent text-headingColor"
                } w-full text-start btn mt-3 rounded-md border border-solid relative`}>
                Requests
            </button>

            <div className='mt-[100px] w-full '>
                <button 
                    className='w-full  bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white'
                >
                    <Link to={user?.role?.includes("patient") ? "/users/profile/me" : "/doctors/profile/me"}>
                        Exit Dashboard
                    </Link>
                </button>

            </div>

        </div>      
    </div>
  )
}

export default Tabs