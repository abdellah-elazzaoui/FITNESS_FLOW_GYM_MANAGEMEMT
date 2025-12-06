import React, { use } from 'react';
import { NavLink } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Side = ({setIsAuthenticated,user}) => {
  const navLinkClass = ({ isActive }) =>
    `px-6 py-4 w-full text-lg font-semibold rounded-xl transition-all duration-300 cursor-pointer flex items-center space-x-3 ${
      isActive
        ? 'bg-white text-blue-600 shadow-lg shadow-blue-600/30 border border-blue-100 transform scale-105'
        : 'text-white hover:bg-white/20 hover:text-white hover:shadow-md'
    }`

  const navigate = useNavigate(); 

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

  return (
    <div className='w-1/5 bg-gradient-to-b from-blue-800 to-blue-600 min-h-screen p-6 shadow-2xl'>
      {/* Profile Section */}
      <div className='flex flex-col items-center space-y-4 pb-8 border-b border-blue-400/50 mb-8'>
        <div className='w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-blue-300'>
          <span className='text-2xl font-bold text-blue-600 capitalize'>{user?.username? user.username.slice(0,1) : ""}</span>
        </div>
        <div className='text-center'>
          <div className='text-xl font-bold text-white mb-1'>{user? user.username : ""}</div>
          
        </div>
        <div className='w-16 h-1 bg-blue-300/60 rounded-full'></div>
      </div>

      {/* Navigation Menu */}
      <div className='space-y-3'>
        <NavLink className={navLinkClass} to="/dashboard">
          <div className='w-6 h-6 flex items-center justify-center'>
            📊
          </div>
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink className={navLinkClass} to="/subscription">
          <div className='w-6 h-6 flex items-center justify-center'>
            💳
          </div>
          <span>Subscriptions</span>
        </NavLink>
        
        <NavLink className={navLinkClass} to="/session">
          <div className='w-6 h-6 flex items-center justify-center'>
            🏋️
          </div>
          <span>Sessions</span>
        </NavLink>
        
        <NavLink className={navLinkClass} to="/coach">
          <div className='w-6 h-6 flex items-center justify-center'>
            👨‍💼
          </div>
          <span>Coach</span>
        </NavLink>
        
        <div className="px-6 py-4 w-full text-lg font-semibold rounded-xl transition-all duration-300 cursor-pointer flex items-center space-x-3 text-white transform hover:text-red-500 hover:bg-white" 
        onClick={()=>{logout_user()}}
        >
          <div className='w-6 h-6 flex items-center justify-center'>
            <CiLogout />
          </div>
          <span>Logout</span>
        </div>
      </div>

      
    </div>
  )
}

export default Side