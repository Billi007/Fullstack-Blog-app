import React, {useContext, useEffect, useState} from "react";
import { FaRegHeart } from "react-icons/fa";
import { FiMoon } from "react-icons/fi";
import { FiSun } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  //const [toggleNav, setToggleNav] = useState(false)
  const navigate = useNavigate();
  const {user, setUser} = useContext(UserContext);
  //console.log(user)


  const defaultAvatar = "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png";

  useEffect(() => {
  const root = window.document.documentElement;
  if(theme){
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }else{
    root.classList.remove('dark');
    localStorage.setItem('theme', 'light')
  }
    
  }, [theme])
  
  const toggle = () => setTheme(prev => !prev);
  //const toggleNavbar = setToggleNav(prev => !prev)

  const logout = async () => {
    try {

    const confirm = window.confirm('Are you sure you want to logout?')
    if(!confirm) return;

      const res = await axios.post(
        "http://localhost:4000/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null)
      toast.success("Logged out successfully");
      navigate("/signin");
    } catch (error) {
      const errorMessage =
        error?.response?.data.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.log(error.message);
    }
  };


  return (
    <>
      <nav className="w-full bg-white dark:bg-black shadow-md fixed top-0 z-50">
        <div className="navbar shadow-sm bg-white dark:bg-black px-8">
        <div className="flex-1">
          <div className="btn-ghost text-xl text-blue-500 dark:text-blue-300">TheDailyBlogs</div>
        </div>
        <div>
          <ul className="flex items-center gap-6 text-xl">
            <li className="cursor-pointer">
              <Link to={'/blog/liked'}>
              <FaRegHeart />
              </Link>
            </li>
            <li onClick={toggle} className="cursor-pointer">
              {theme ? <FiSun/> : <FiMoon />}
            </li>
          </ul>
        </div>

        
        <div className="flex-none">
          <ul className="menu menu-horizontal px-2 items-center">
            <li>
              <details>
                <summary className="text-xl px-5"><RxHamburgerMenu /></summary>
                <ul className=" bg-white dark:bg-black w-32">
                  <li>
                    <Link to={"/"} className="hover:bg-red-50 hover:dark:bg-gray-900">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to={'/dashboard'} className="hover:bg-red-50 hover:dark:bg-gray-900">Dashboard</Link>
                  </li>
                  <li>
                    <Link to={"/blog/create"} className="hover:bg-red-50 hover:dark:bg-gray-900">
                      Create a blog
                    </Link>
                  </li>
                  <li>
                    <button onClick={logout} className="hover:bg-red-50 hover:dark:bg-gray-900">
                      Logout <MdOutlineLogout />
                    </button>
                  </li>
                </ul>
              </details>
            </li>

            {/* Handle profile Picture */}
            <li>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <Link to={`profile/${user?.user?._id}`}>
                  <img
                    alt={ 'User Avtar'}
                    src={user?.user?.avtar || defaultAvatar}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultAvatar;
                    }}
                    loading="lazy"
                  />
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      </nav>
    </>
  );
};

export default Navbar;

{
  /* <nav className='flex justify-between items-center px-10 py-3 font-semibold text-lg'>
<h1 className='text-blue-400'>TheDailyUpload</h1>
<ul  className='flex justify-center items-center gap-7 cursor-pointer'>
 <li className='hover:opacity-75'>Dashboard</li>
 <li className='hover:opacity-75'>Create blog</li>
 <li className='text-2xl hover:opacity-75'><FaRegHeart /></li>
  {theme ?  <li className='text-2xl hover:opacity-75'><FiMoon /></li> : <li className='text-xl hover:opacity-75'><FiSun /></li>}
  <li><MdOutlineLogout /></li>
</ul>

</nav>
<div className='border-t border-gray-300 border-opacity-80 w-full scale-y-50 origin-top'></div> */
}
