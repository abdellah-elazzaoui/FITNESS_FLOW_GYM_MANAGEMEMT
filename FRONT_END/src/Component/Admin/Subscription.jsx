import React, { useEffect, useState } from 'react'
import Side from './Side'
import api from '../../api'
const Subscription = ({setIsAuthenticated}) => {
  const [data,setData] = useState({});
  const [subscriptions, setSubscriptions] = useState();
  const [loading,setLoading] = useState(false);

  async function get_data() {
    try{
      setLoading(true);
      const response = await api.get("admin_dashboard/");
      console.log(response.data);
      setData(response.data);
      setSubscriptions(response.data.subscriptions);  
    }
    catch (err){
      throw new Error(err.message);
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    get_data();
  },[])

  //console.log("subscriptions",subscriptions);
  if(loading){
    return(
      <div className='flex justify-center items-center mx-auto w-full'>
          Loading Page ...  
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen flex'>
        <Side setIsAuthenticated={setIsAuthenticated} user={data?.user? data.user : {}}/>

        <div className='flex-row space-y-2 w-4/5 '>

          <div className='bg-gray-100  w-11/12 h-auto flex justify-center mx-auto items-center rounded-2xl text-2xl p-6'>
            <table className='w-full'>
                <thead>
                    <tr className='bg-gray-200 rounded-2xl'>
                        <th className='p-4 text-left'>Number</th>
                        <th className='p-4 text-left'>Full Name</th>
                        <th className='p-4 text-left'>Start Day</th>
                        <th className='p-4 text-left'>End Date</th>
                        <th className='p-4 text-left'>Remaining</th>
                    </tr>
                </thead>
                <tbody>
                      {
                        subscriptions? subscriptions.map((item, index) => (
                            <tr key={index} className='border-b border-gray-400 hover:bg-gray-100 '>
                                <td className='p-4 text-center font-semibold'>{index + 1}</td>
                                <td className='p-4'>{item? item.user.first_name : ""} {item? item.user.last_name : ""}</td>
                                <td className='p-4'>{item? item.start_date : ""}</td>
                                <td className='p-4'>{item? item.end_date : ""}</td>
                                <td className='p-4'>{item.days_remaining} Days </td>
                            </tr>
                        )) : <></>
                    } 
                </tbody>  
            </table>
          </div>  
        </div>

        
     
    </div>
  )
}

export default Subscription
