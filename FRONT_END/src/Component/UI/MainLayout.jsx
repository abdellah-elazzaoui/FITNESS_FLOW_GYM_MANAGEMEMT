import React,{useState} from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import { TbMessageChatbot } from "react-icons/tb";
import ChatInterface from '../Chatbot/ChatInterface'

const MainLayout = ({user,IsAuthenticated,setIsAuthenticated}) => {
  const [showChatbot, setShowChatbot] = useState(false);
  return (
    <div className='flex-col justify-between'>
      
     
      <Header user={user} IsAuthenticated={IsAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <ToastContainer 
            position='top-right'
            autoClose={1000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            theme='light'
            />
      {showChatbot? <ChatInterface setShowChatbot={setShowChatbot} /> : <Outlet />}
      <div className='absolute right-0 bottom-5 cursor-pointer w-16 h-16 m-4 p-2 rounded-full bg-blue-600 flex justify-center items-center hover:bg-blue-700 shadow-lg shadow-blue-600 text-white'
      onClick={() => setShowChatbot(pre => !pre)}
      >
      <TbMessageChatbot className=' w-full h-full animation animate-pulse'/>
      </div>
      <Footer />

    </div>
  )
}

export default MainLayout  // Make sure this is default export