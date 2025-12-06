// Header.jsx
import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from './logo_fit.png';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaAngleUp } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
const Header = ({user,IsAuthenticated,setIsAuthenticated}) => {

  const navigate = useNavigate();
  const [showBar,setShowBar] = useState(false);

  function logout_user() {
    const response = window.confirm("Are you sure you want to logout?");
    if (!response){
      return;
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    toast.success("Logging out",{
      autoClose:1000,
      position:"top-right"
    })
    navigate("/login");
  }

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 text-medium rounded-lg font-medium transition-all text-medium duration-200 cursor-pointer ${
      isActive
        ? 'text-white bg-blue-600 shadow-lg shadow-blue-600/25'
        : 'text-blue-600 hover:text-white hover:bg-blue-600'
    }`
  
  if(user.is_staff || user.is_superuser){
    return(
    <div>
      
    </div>
  )
  }  
    
  return (
    
    <div className='flex justify-between p-4 bg-gray-50  border-2 w-full'>
      <Link to={IsAuthenticated? '/dashboard': '/'} className='text-2xl font-bold  text-center w-2/3 italic items-center flex justify-center'>
      <div> <img src={logo} alt="logo" className='w-10 h-10 rounded-full mr-2' />  </div> FITNESS <label className='text-blue-600 ml-1 cursor-pointer'> FLOW</label>
      </Link>
      <div className='w-1/3 flex justify-end grid-cols-4 gap-2'>

        {IsAuthenticated ?(
          <>
            <NavLink to="/dashboard" className={navLinkClass}>dashbord</NavLink>
            <NavLink to="/contact" className={navLinkClass}>contact</NavLink>
            <NavLink to="/about" className={navLinkClass}>about</NavLink>
            <div   
              className="px-4 py-2 flex justify-between gap-2 border-2  text-medium rounded-lg font-medium transition-all text-medium duration-200 pr-2 text-blue-500 cursor-pointer transform"
            onClick={()=>{setShowBar(pre => !pre)}}
            >
              <div className=' h-full rounded-full text-white bg-blue-600 w-6 text-center'>{user?.username? user.username.slice(0,1) :  ""}</div> 
              {user? user.username :  ""}
              <div className='text-gray-400 text-center flex justify-center items-center'>{showBar? <FaAngleUp /> : <FaAngleDown />} </div>
            </div>

            {showBar && <div className='absolute flex-row right-2 top-20 bg-white shadow-lg rounded-md p-4 w-48 space-y-2'>
                <div><Link to="/profile" 
                  className="px-4 py-2 text-medium rounded-lg font-medium transition-all text-medium duration-200 pr-2 cursor-pointer transform "
                > Profile </Link> </div>

                <div> <Link to="/setting" 
                  className="px-4 py-2 text-medium rounded-lg font-medium transition-all text-medium duration-200 pr-2 cursor-pointer transform "
                > Setting </Link> </div>
                <hr />
                <div
                className="px-4 py-2 text-medium rounded-lg font-medium transition-all text-medium duration-200 pr-2 text-red-500 cursor-pointer transform hover:text-red-600"
                onClick={logout_user}>Logout</div>

              </div>}
          
          </>
        ) 
        :
        (
          <>
            <div className='w-1/3 flex justify-center grid-cols-4 gap-2'> </div>
            <NavLink to="/login" className={navLinkClass}>login</NavLink>
            <NavLink to="/register" className={navLinkClass}>register</NavLink>
            <NavLink to="/contact" className={navLinkClass}>contact</NavLink>
            <NavLink to="/about" className={navLinkClass}>about</NavLink>
          
          </>
        )}
      </div>  
    </div>
  )
}

export default Header