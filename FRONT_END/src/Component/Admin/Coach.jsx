import React from 'react'
import Side from './Side'
import api from '../../api';
import { useState } from 'react';
import { useEffect } from 'react';
import Modal from '../UI/Modal'
import Admin_Add_Coach from './Admin_Add_Coach';
import { toast } from 'react-toastify';
const Coach = ({setIsAuthenticated}) => {
  const [data,setData] = useState({});
  const [coachs, setcoachs] = useState([]);
  const [add_coach,setAdd_Coach] = useState(false);
  const [update_coach,setupdatecoach] = useState(false);
  const [updated_coach,setupdatedcoach] = useState({});

  async function get_data() {
    try{
      const response = await api.get("admin_dashboard/");
      console.log(response.data);
      setData(response.data);
      setcoachs(response.data.coachs);
    }
    catch (err){
      throw new Error(err.message);
    }
  }

  useEffect(()=>{
    get_data();
  },[])

  //console.log(coachs);

  async function delete_coach(id){
    try{
      const confirm = window.confirm("Are you sure you want to delete coach ?");
      if(confirm){
        const response = await api.delete("admin_delete_coach/",{data:{"id":id}});
        toast.success("Coach Deleted Successfully",{
          autoClose:1500,
          position:"top-right"
        });
        setTimeout(() => {
          window.location.reload();
        },2000);
      }
    }
    catch(error){
      const error_message = error.response.data.error || " Operation Failed ";
      toast.success(error_message,{
        autoClose:1500,
        position:"top-right"
      });
    }
  }
  return (
    <>
      {
        add_coach &&
        <Modal>
          <Admin_Add_Coach setAdd_Coach={setAdd_Coach}/>
        </Modal>
      }

      {
        update_coach &&
        <Modal>
          <Admin_Add_Coach setAdd_Coach={setupdatecoach}  updated_coach={updated_coach} />
        </Modal>
      }


      <div className='w-full min-h-screen flex'>
          <Side setIsAuthenticated={setIsAuthenticated} user={data?.user ? data.user : {}}/>

          <div className='bg-gray-100  w-11/12 h-auto flex-row justify-center mx-auto items-center rounded-2xl text-2xl p-6'>
            <div className='flex justify-between p-2'>
            <div className='text-4xl font-bold text-center p-2 '>FITNESS FLOW 's Coachs</div>
            <div className='p-2 text-center text-white text-2xl rounded-xl transform hover:scale-105 cursor-pointer bg-green-600/90 font-semibold'
            onClick={()=>{setAdd_Coach(true)}}
            >Add Coach</div>
            </div>
              <table className='w-full'>
                  <thead>
                      <tr className='bg-gray-200 rounded-2xl'>
                          <th className='p-4 text-left'>Number</th>
                          <th className='p-4 text-left'>Full Name</th>
                          <th className='p-4 text-left'>Speciality</th>
                          <th className='p-4 text-left'>Phone</th>
                          <th className='p-4 text-left'>Birthday</th> 
                          <th className='p-4 text-left'></th> 
                      </tr>
                  </thead>
                  <tbody>
                        {
                          coachs? coachs.map((item, index) => (
                              <tr key={index} className='border-b border-gray-400 hover:bg-gray-100 '>
                                  <td className='p-4 text-center font-semibold'>{index + 1}</td>
                                  <td className='p-4'>{item? item.first_name : ""} {item? item.last_name : ""}</td>
                                  <td className='p-4 capitalize'>{item? item.speciality : ""}</td>
                                  <td className='p-4'>{item? item.phone:""}</td>
                                  <td className='p-4'> {item? item.birthday : ""} </td>
                                  <td className='p-4 flex space-x-2'>  
                                      <div className='p-2 text-center text-white text-2xl rounded-xl transform hover:scale-105 cursor-pointer bg-blue-600'
                                      onClick={() => {setupdatecoach(true); setupdatedcoach(item? item : {} ) }}
                                      >update</div>
                                      <div className='p-2 text-center text-white text-2xl rounded-xl transform hover:scale-105 cursor-pointer bg-red-500'
                                      onClick={()=>{delete_coach(item? item.id : "")}}
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

export default Coach
