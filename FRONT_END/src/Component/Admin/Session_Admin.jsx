import React, { useEffect } from 'react'
import Side from './Side'
import api from '../../api';
import { useState } from 'react';
import Modal from '../UI/Modal';
import Admin_Add_Session from './Admin_Add_Session';
import { toast } from 'react-toastify';
const Session = ({setIsAuthenticated}) => {
  const [data,setData] = useState({});
  const [sessions,setSessions] = useState([]);
  const [loading,setLoading] = useState(false);
  const [add_session,setAdd_Session] = useState(false);
  const [update_session,setUpdate_Session]=useState(false);
  const [updated_item,setUpdatedItem]=useState({})
  const [coachs,setCoachs] = useState([]);
  async function dashboard_data() {
    try{
      setLoading(true);
      const response = await api.get("admin_dashboard/");
      console.log(response.data);
      setData(response.data);
      setSessions(response.data.sessions);
      setCoachs(response.data.coachs);
    }
    catch (err){
      //console.log(err.message);
      throw new Error(err.message);
    }
    finally{
      setLoading(false);
    }
  }
  async function delete_session(id) {
      try{
        const confirm = window.confirm("Are you sure you want to delete this session ?");
        if (confirm){
          const response = await api.delete("admin_delete_session/",{data:{"id":id}});
          toast.success(response.data.message,{
                      autoClose:1500,
                      position:"top-right"
                    });
          setTimeout(() => {
            window.location.reload();
          }, 2000);          
        }
        
      }
      catch(err){
        const err_message = err.response.data.error || "ERROR with Deleting Session";
        toast.error(err_message,{
          autoClose:1500,
          position:"top-right"
        });
      }
      
    }
  
  useEffect(()=>{
    dashboard_data();
  },[]);

  if(loading){
    return(
      <div> Loading </div>
    )
  }

  //console.log(updated_item);
  return (
    <>
      {add_session && <div>
        <Modal> <Admin_Add_Session setAdd_Session={setAdd_Session} coachs={coachs? coachs :[]}/> </Modal>  
      </div>}
      {update_session && <div>
        <Modal> <Admin_Add_Session setAdd_Session={setUpdate_Session} coachs={coachs? coachs :[]} updated_item={updated_item}/> </Modal>  
      </div>}

      <div className='w-full min-h-screen flex'>
          <Side setIsAuthenticated={setIsAuthenticated} user={data?.user?  data.user : {}}/>
          <div className='bg-gray-100  w-11/12 h-auto flex-row justify-center mx-auto items-center rounded-2xl text-2xl p-6'>
            <div className='flex justify-between p-2'>
            <div className='text-4xl font-bold text-center p-2 '>FITNESS FLOW 's Wekly Sessions </div>
            <div className='p-2 text-center text-white text-2xl rounded-xl transform hover:scale-105 cursor-pointer bg-green-600/90 font-semibold'
            onClick={()=>{setAdd_Session(true)}}
            >Add Session</div>
            </div>
              <table className='w-full'>
                  <thead>
                      <tr className='bg-gray-200 rounded-2xl'>
                          <th className='p-4 text-left'>Number</th>
                          <th className='p-4 text-left'>Type</th>
                          <th className='p-4 text-left'>Day</th>
                          <th className='p-4 text-left'>Time</th>
                          <th className='p-4 text-left'>Coach</th> 
                          <th className='p-4 text-left'>Duration</th> 


                      </tr>
                  </thead>
                  <tbody>
                        {
                          sessions? sessions.map((item, index) => (
                              <tr key={index} className='border-b border-gray-400 hover:bg-gray-100 '>
                                  <td className='p-4 text-center font-semibold'>{index + 1}</td>
                                  <td className='p-4'>{item? item.name : ""}</td>
                                  <td className='p-4 capitalize'>{item? item.day : ""}</td>
                                  <td className='p-4'>{item? item.time : ""}</td>
                                  <td className='p-4'> {item? item.coach.first_name :""} {item? item.coach.last_name : ""}</td>
                                  <td className='p-4'>{item? item.duration : ""} min</td>
                                  <td className='p-4 flex space-x-2'>  
                                      <div className='p-2 text-center text-white text-2xl rounded-xl transform hover:scale-105 cursor-pointer bg-blue-600'
                                      onClick={()=>{setUpdate_Session(true);
                                        setUpdatedItem(item);
                                      }}
                                      >update</div>
                                      <div className='p-2 text-center text-white text-2xl rounded-xl transform hover:scale-105 cursor-pointer bg-red-500'
                                      onClick={() => {delete_session(item.id);}}
                                      >delete</div>
                                  </td>

                              </tr>
                          )) : <></>
                      } 
                  </tbody>  
              </table>
            </div>     
      </div>
    </>
  )
}

export default Session



{/*
<div className='w-3/5 justify-center items-center mx-auto mt-5'>
          <div className='w-full grid grid-cols-3 gap-10 justify-center items-center mx-auto'>
          {sessions? sessions.map((item, index) => (
            <div key={index} className='h-64 bg-gradient-to-tr from-blue-500 to-blue-700 rounded-2xl shadow-lg shadow-blue-600/5 text-center flex justify-center items-center w-full mx-auto text-white text-2xl font-semibold transform hover:translate-y-1'>
              
              <div  className='flex flex-col space-y-2'>
                  <div>Session : {item? item.name : ""}</div>
                  <div>Day : {item? item.day : ""}</div>
                  <div>Time : {item? item.time : ""}</div>
                  <div>Coach : {item? item.coach.first_name :""} {item? item.coach.last_name : ""}</div>
                  <div>Duration : {item? item.duration : ""}</div>
              </div>

            </div>  
            )) : <></>}
            </div> 

            <div className='w-full grid grid-cols-3 gap-10 justify-center items-center mx-auto mt-10 text-2xl text-center text-white font-semibold'>
              <div className='w-full cursor-pointer transform hover:scale-105 p-2 bg-green-600 rounded-xl'>Add Session</div>
              <div className='w-full cursor-pointer transform hover:scale-105 p-2 bg-red-500 rounded-xl  '>Delete Session</div>
              <div className='w-full cursor-pointer transform hover:scale-105 p-2 bg-blue-600 rounded-xl '>Update Session</div>
            </div>
            
             
        </div>
  

*/}