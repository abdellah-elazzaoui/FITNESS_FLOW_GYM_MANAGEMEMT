import React, { useEffect, useState } from 'react'
import api from '../../api';
const Profile = ({user}) => {
    const [stats,setStats] = useState({});

    async function get_data() {
        try{
            const response =await api.get("user_profile_page/");
            console.log(response.data);
            if(response){
                setStats(response.data);
            }
        }
        catch(err){
            throw new Error(err.message);
        }
    }
    useEffect(()=>{
        get_data();
    },[])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
  };

  const recent_activity = stats? stats.recent_activity : {};
  //console.log('Recent Activity - ',recent_activity);

  const goal_progress = stats?.goal? ( stats.goal.goal_type === "weight_loss" ?
        Math.min( Math.abs( (stats.goal.current_value - stats.weight) / (stats.goal.current_value - stats.goal.target_value) ).toFixed(2), 1 ) * 100
        :
        Math.min((stats.weight - stats.goal.current_value) / (stats.goal.target_value - stats.goal.current_value),1) * 100)
        :0;

   //console.log(goal_progress);     
        
  return (
    <div className='flex w-full h-full min-h-screen bg-gray-50'>
        
        <div className='w-1/4 bg-gradient-to-t from-blue-600 to-blue-500 text-white p-6 shadow-xl'>
            
            <div className='flex flex-col items-center space-y-4 pb-6 border-b border-blue-400'>
                <div className='w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg'>
                    <span className='text-3xl font-bold text-blue-600'>{user? user.first_name.slice(0,1) : ""}{user? user.last_name.slice(0,1)  : ""}</span>
                </div>
                <div className='text-center'>
                    <div className='text-2xl font-semibold'>{user? user.first_name : ""} {user? user.last_name : ""}</div>
                    <div className='italic text-blue-100'>Member Since: {user?  formatDate(user.date_joined) : "" }</div>
                </div>
                <div className='w-20 h-1 bg-blue-300 rounded-full'></div>
            </div>

            {/* Profile Details */}
            <div className='space-y-6 mt-6'>
                <div className='bg-white/10 rounded-lg p-4 backdrop-blur-sm tranform hover:bg-white/5'>
                    <div className='flex justify-between items-center '>
                        <div className='font-medium text-blue-100'>Email</div>
                        <div className='text-white font-semibold'>{user? user.email : ""}</div>
                    </div>
                </div>
                
                <div className='bg-white/10 rounded-lg p-4 backdrop-blur-sm tranform hover:bg-white/5'>
                    <div className='flex justify-between items-center'>
                        <div className='font-medium text-blue-100'>Phone</div>
                        <div className='text-white font-semibold'>{user? user.phone : ""}</div>
                    </div>
                </div>
                
                <div className='bg-white/10 rounded-lg p-4 backdrop-blur-sm tranform hover:bg-white/5'>
                    <div className='flex justify-between items-center'>
                        <div className='font-medium text-blue-100'>Birthday</div>
                        <div className='text-white font-semibold'>{user? user.birthday : ""}</div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className='mt-8 space-y-4'>
                <h3 className='font-semibold text-lg text-center text-blue-100'>Activity Stats</h3>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm tranform hover:bg-white/5'>
                        <div className='text-2xl font-bold'>{stats? stats.workouts : ""}</div>
                        <div className='text-sm text-blue-100'>Workouts</div>
                    </div>
                    <div className='bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm tranform hover:bg-white/5'>
                        <div className='text-2xl font-bold'>{stats? stats.weight : ""} Kg</div>
                        <div className='text-sm text-blue-100'>Weight</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Content Area */}
        <div className='w-3/4 p-8'>
            <div className='bg-white rounded-xl shadow-lg p-6'>
                <h2 className='text-3xl font-bold text-gray-800 mb-6'>Dashboard Overview</h2>
                
                {/* Recent Activity */}
                <div className='mb-8'>
                    <h3 className='text-xl font-semibold text-gray-700 mb-4'>Recent Activity</h3>
                    <div className='space-y-3'>
                        {recent_activity? recent_activity.map((item, index) => (
                            <div key={index} className='flex justify-between items-center p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition duration-200 shadow-lg shadow-gray-100'>
                                <div>
                                    <div className='font-medium text-gray-800'>{item.session.name}</div>
                                    <div className='text-sm text-gray-500'>{item.date}</div>
                                </div>
                                
                            </div>
                        )) : <></>}
                    </div>
                </div>

                {/* Goals */}
                <div>
                    <h3 className='text-xl font-semibold text-gray-700 mb-4'>Fitness Goals</h3>
                    
                        <div className='bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg shadow-green-600 transform hover:bg-green-700'>
                            <div className='text-center text-xl font-semibold'>{stats?.goal? stats.goal.title : ""}</div>
                            <div className='text-lg font-semibold'>{stats?.goal? stats.goal.goal_type:""}</div>
                            
                            <div className='text-sm opacity-90 flex justify-between'>Target: {stats?.goal? stats.goal.target_value:""} kg <div className='font-semibold pr-2'>{goal_progress}%</div></div>

                            <div className='w-full bg-green-400 rounded-full h-2 mt-2'>
                                <div className='bg-white h-2 rounded-full'
                                style={{width:`${goal_progress}%`}}
                                ></div>
                            </div>
                        </div>
                        
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile