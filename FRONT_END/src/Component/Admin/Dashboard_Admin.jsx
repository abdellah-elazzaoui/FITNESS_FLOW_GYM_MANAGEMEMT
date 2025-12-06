import React, { useEffect, useState } from 'react'
import Side from './Side'
import api from '../../api'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS ,defaults} from 'chart.js/auto';

const Dashboard_Admin = ({setIsAuthenticated}) => {
  const [data , setData] = useState({});

  

  async function dashboard_data() {
    try{
      const response = await api.get("admin_dashboard/");
      console.log(response.data);
      setData(response.data);
    }
    catch (err){
      //console.log(err.message);
      throw new Error(err.message);
    }
    
  }

  useEffect(()=>{
    dashboard_data();
  },[]);

  const active_rate = data? Math.abs(data.total_active/data.total).toFixed(2)*100 : 0;
  


  return (
    <div className='w-full min-h-screen flex'>
        <Side setIsAuthenticated={setIsAuthenticated} user={data?.user? data.user : {}}/>

      <div className='w-3/5 flex flex-col space-y-24  items-center mx-auto  space-x-4'>
        <div className='w-full grid grid-cols-4 gap-4 mt-6'>
          {/* Total Member Card */}
          <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl shadow-blue-500/25 p-6 text-white transform hover:scale-105 transition duration-300'>
            <div className='text-lg font-semibold text-center opacity-90 mb-2'>Total Members</div>
            <div className='text-3xl font-bold text-center'>{data? data.total :"1,024"}</div>
            <div className='flex items-center justify-center mt-2 text-green-300 text-sm'>
              <span> + {data? data.total - data.last_month_total : 0 }</span>
              <span className='ml-1'>from last month</span>
            </div>
          </div>

          {/* Active Member Card */}
          <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl shadow-green-500/25 p-6 text-white transform hover:scale-105 transition duration-300'>
            <div className='text-lg font-semibold text-center opacity-90 mb-2'>Active Members</div>
            <div className='text-3xl font-bold text-center'>{data?.total_active? data.total_active : ""}</div>
            <div className='flex items-center justify-center mt-2 text-blue-100 text-sm'>
              <span>{active_rate}%</span>
              <span className='ml-1'>active rate</span>
            </div>
          </div>

          {/* Revenue Card */}
          <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl shadow-purple-500/25 p-6 text-white transform hover:scale-105 transition duration-300'>
            <div className='text-lg font-semibold text-center opacity-90 mb-2'>Monthly Revenue</div>
            <div className='text-3xl font-bold text-center'>${data? data.revenue : ""}</div>
            <div className='flex items-center justify-center mt-2 text-green-300 text-sm'>
              
              <span className='ml-1'>growth</span>
            </div>
          </div>

          {/* New Sign-ups Card */}
          <div className='bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl shadow-orange-500/25 p-6 text-white transform hover:scale-105 transition duration-300'>
            <div className='text-lg font-semibold text-center opacity-90 mb-2'>New Sign-ups</div>
            <div className='text-3xl font-bold text-center'>{data? data.today_signup : ""}</div>
            <div className='flex items-center justify-center mt-2 text-blue-100 text-sm'>
              <span>Today</span>
            </div>
          </div>
        </div>

        <div className='w-4/5 flex justify-center mx-auto h-80  rounded-2xl shadow-lg p-6 border border-blue-200'>
          <Line
            data={{
              labels: data?.total_months ? data.total_months : [],
              datasets: [{
                label: 'Total Subscriptions by Month',
                data: data?.monthly_counts ? data.monthly_counts : [],
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#4f46e5',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
              }]
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: '#374151',
                    font: {
                      size: 14,
                      weight: 'bold'
                    }
                  }
                }
              },
              scales: {
                x: {
                  grid: {
                    color: 'rgba(0,0,0,0.1)'
                  },
                  ticks: {
                    color: '#6b7280'
                  }
                },
                y: {
                  grid: {
                    color: 'rgba(0,0,0,0.1)'
                  },
                  ticks: {
                    color: '#6b7280'
                  }
                }
              }
            }}
            className='w-full'
          />
</div>
      </div>

      
     
    </div>
  )
}

export default Dashboard_Admin
