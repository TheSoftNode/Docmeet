import { useEffect, useRef, useContext } from "react";
import logo2 from "../../assets/Logos/Color logo - no background.svg";
// import logo2 from "../../assets/Logos/Color logo with background.svg";
import { Link, NavLink } from 'react-router-dom';
import { BiMenu } from "react-icons/bi";
import { authContext } from "../../context/AuthContext";
import ThemeToggler from "../ThemeSwitcher/ThemeToggler";


const navLinks = [
  {
    path: '/home',
    display: 'Home'
  },
  {
    path: '/doctors',
    display: 'Find a Doctor',
  },
  {
    path: '/services',
    display: 'Services',
  },
  {
    path: '/contact',
    display: 'Contact'
  },
  {
    path: '/about',
    display: 'About'
  }
]

const Header = () =>
{

  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const { user, token } = useContext(authContext);

  const handleStickyHeader = () =>
  {
    window.addEventListener('scroll', () =>
    {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80)
      {
        headerRef?.current?.classList?.add('sticky_header');
      } else
      {
        headerRef?.current?.classList?.remove('sticky_header')
      }
    })
  }


  useEffect(() =>
  {
    handleStickyHeader()

    return () => window.removeEventListener('scroll', handleStickyHeader)
  });

  const toggleMenu = () => menuRef.current.classList.toggle('show_menu')

  return (
    <header className="header flex items-center bg-emerald-50" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          {/* ====== logo ======= */}
          <div>
            <Link to="/">
              <img src={logo2} alt="" className="w-[50%] sm:w-[200px] text-green" />
            </Link>
          </div>

          {/* ======= menu ========= */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {
                navLinks.map((link, index) => (<li key={index}>
                  <NavLink to={link.path} className={navClass => navClass.isActive ? "text-primaryColor text-[16px] leading-7 font-[600]" : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor"}
                  >
                    {link.display}
                  </NavLink>
                </li>
                ))}
            </ul>
          </div>


          {/* ====== nav right ======== */}
          <div className="flex items-center gap-4">
            {token && user ? (<div >
              <Link to={`${user?.role?.includes("doctor") ? "/doctors/profile/me" : "/users/profile/me"}`}>

                {user.photo !== null && user.photo !== "default.jpg"
                  ? (<figure className="w-[39px] h-[39px] rounded-full cursor-pointer">
                    <img src={user?.photo} className="w-[39px] h-[39px] rounded-full" alt="" />
                  </figure>)
                  : (<p> Hi {user.name}</p>)
                }

              </Link>
            </div>) : (
              <Link to='/login'>
                <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                  Login
                </button>
              </Link>
            )}
            <ThemeToggler />
            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className='w-6 h-6 cursor-pointer' />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;