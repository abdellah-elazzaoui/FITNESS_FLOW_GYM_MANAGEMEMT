import React, { use, useEffect, useState } from 'react';
import { Line,Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS ,defaults} from 'chart.js/auto';
import Session from './Session';
import api from '../../api';
import Modal from './Modal';
import AddSession from './AddSession';
import AddMesure from './AddMesure';
import AddGoal from './AddGoal';
import { toast } from 'react-toastify';
import AddSubscription from './AddSubscription';
defaults.responsive = true;


const Dashbourd_user = ({user ,setUser}) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [last_mesure,setLast_mesure]=useState({});
    const [goal,setGoal]=useState({});
    const [subscription,setSubscription]=useState({});  
    const [add_session,setAddSession] = useState(false);
    const [addMesure,setAddMesure] = useState(false);
    const [addGoal,setAddGoal] = useState(false);
    const [stats,setStats] = useState([]);
    const [Mesures,setMesure] = useState([]);
    //const [username,setUsername] =useState("");
    //const [user,setUser]=useState({});
    const measurementKeys = ['weight', 'height', 'bmi', 'bmi_category'];
    const [session_done,setSession_done]=useState(0);
    const total_session = 4;



    async function get_dashboard_data() {
        try {
            const response = await api.get("dashboard_user_data/");
            console.log("data:", response.data);
            setUser(response.data.user || {});
            setSessions(response.data.sessions || []);
            setLast_mesure(response.data.last_mesure || {});
            setStats(response.data.stats || []);
            //setUsername(response.data.user.username || "");
            setSubscription(response.data.subscription || "");
            setSession_done(Number(response.data.weakly_progress) || 0);
            const mesureData = response.data.stats.reduce((acc, mesure) => {
                const date = new Date(mesure.date).toLocaleDateString();
                acc.date.push(date);
                acc.weight.push(parseFloat(mesure.weight));
                return acc;
            }, { date: [], weight: [] });
            setMesure(mesureData);
            setGoal(response.data.goal || {});
            //console.log("mesure:",mesureData);

        
            
            //console.log(Mesures);
            
        } catch (error) {
            console.log(error.message);
            setSessions([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        get_dashboard_data();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl">Loading sessions...</div>
            </div>
        );
    }

    if(user.has_active_subscription === false){
    return(
        <div className='flex flex-col justify-center items-center h-screen space-y-6'>  
            <div className='text-3xl font-bold text-red-600'>You don't have an active subscription</div>
            <div className='text-2xl font-semibold'>Please subscribe to a plan to access the dashboard</div>
            <AddSubscription />
        </div>
    )
  }


    const weaklyProgress = Math.min(100, Math.round((session_done / total_session) * 100));
    //console.log("weekly Progress:",weaklyProgress);
    const goal_progress = goal.goal_type? ( goal.goal_type == "weight_loss" ?
        Math.min( Math.abs( (goal.current_value - last_mesure.weight) / (goal.current_value - goal.target_value) ).toFixed(2), 1 ) * 100
        :
        Math.min((last_mesure.weight - goal.current_value) / (goal.target_value - goal.current_value),1) * 100)
        :0;
    
    const PLAN_DURATIONS = {'3_months': 90,'6_months': 180,'12_months': 365}    
    const left_days = subscription?.days_remaining?  Number(subscription.days_remaining) : 0
    const plan_duration =subscription?.plan?  PLAN_DURATIONS[subscription?.plan] : NaN; 
    const Remining = Math.min( Math.abs(left_days/plan_duration).toFixed(2), 1 ) * 100
    //const Remaining = plan_duration > 0 ? (left_days / plan_duration) * 100 : 0;*/

    //console.log(Remining);

    //const color = weaklyProgress >= 80? "green" : weaklyProgress >= 50? "yellow" : "orange";
    
    
    

   

  return (
    <>  
       {add_session && 
       <div>
            <Modal> <AddSession weaklyProgress={weaklyProgress}  setAddSession={setAddSession}/> </Modal>
        </div>}
        {addMesure && 
       <div>
            <Modal> <AddMesure last_mesure={last_mesure}  setAddMesure={setAddMesure}/> </Modal>
        </div>}
        {addGoal && 
       <div>
            <Modal> <AddGoal  setAddGoal={setAddGoal}/> </Modal>
        </div>}
        <div className='flex justify-between items-center mx-auto'>
            <div className='w-2/3'>
                <div className='text-3xl font-bold p-4 pl-10'>Hello , <span className='text-blue-600'> {user? user.username:""} </span> </div>
                <div className='text-2xl font-semibold pl-10'>Your Personnel Table </div>
            </div>
            <div className='w-1/4 flex-col justify-center items-center mx-auto space-y-3'>
                <div className='text-xl font-semibold'>Remaining Days - {left_days? left_days : 0} days</div>
                <div className="w-full bg-gray-300 rounded-full h-4">
                    <div 
                            className={`h-4 rounded-full transition-all duration-500 ${
                                Remining >= 75 ? 'bg-green-500' :
                                Remining >= 50 ? 'bg-yellow-400' :
                                Remining >= 25 ? 'bg-orange-500' :
                                'bg-red-500'
                            }`}
                            style={{ width: `${Remining}%` }}
                    ></div>
                </div>
            </div>        
        </div>                                    
        <div className='w-full h-96 flex justify-center'>
            <div className='w-2/5 h-ful p-2 flex justify-center '>

                <Line
                    data={{
                        labels: Mesures? Mesures.date : [] ,
                        datasets:[{
                            label:'poids',
                            data:Mesures? Mesures.weight : [],
                            borderColor: 'blue',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                        }]
                    }}
                    options={{
                        maintainAspectRatio: false
                    }}
                />

            </div>

            <div className='w-2/5 h-full flex justify-center items-center '>
                    <div className='w-full h-auto flex justify-between mx-auto '>
                        {/* Doughnut */}
                        <div className='w-1/2 '>
                            <div className='text-center text-2xl font-bold text-blue-700'>Weakly Progress</div>
                            <Doughnut 
   
                                data={{
                                    labels:[],
                                    datasets:[{
                                        label:"Session",
                                        data:[session_done , session_done? total_session-session_done : 4],
                                        backgroundColor:["blue","gray"]
                                    }]
                                    
                                    
                                }}

                                plugins={[{
                                                id: 'centerText',
                                                afterDraw: (chart) => {
                                                    const { ctx, chartArea: { width, height } } = chart;
                                                    ctx.save();
                                                    ctx.font = "bold 40px Inter, sans-serif";
                                                    ctx.fillStyle = weaklyProgress >= 100 ? "green" : "blue";
                                                    ctx.textAlign = "center";
                                                    ctx.textBaseline = "middle";
                                                    ctx.fillText(`${Math.round(weaklyProgress)}%`, width / 2, height /2 );
                                                    ctx.font = "15px Inter, sans-serif";
                                                    ctx.fillStyle = "#blue";
                                                    ctx.fillText("complété", width / 2, height / 2 + 30);
                                                    ctx.restore();
                                                }
                                            }]}
                               
                            />
                            
                        </div>

                        <div className='w-1/2 '>
                                <div className='flex justify-between p-4 text-2xl font-semibold'>Sessions done  <div> {session_done}/4 </div></div>
                                <div className='flex justify-between p-4 text-2xl font-semibold'>Remaining   <div> {total_session - session_done} /4</div></div>

                                <div className='text-center text-2xl font-medium'>Progress - {weaklyProgress}%</div>
                                <div className='flex justify-center mx-auto p-2'>

                                    
                                    <div className="w-full bg-gray-300 rounded-full h-4 ">
                                        <div 
                                            className={`h-4 rounded-full transition-all duration-500 ${
                                                weaklyProgress >= 75 ? 'bg-green-500' :
                                                weaklyProgress >= 50 ? 'bg-yellow-400' :
                                                weaklyProgress >= 25 ? 'bg-orange-500' :
                                                'bg-red-500'
                                            }`}
                                            style={{ width: `${weaklyProgress}%` }}
                                        ></div>
                                    </div>
                                       
                                </div>
                                <div className='w-full'>
                                    <button disabled={weaklyProgress===100} onClick={()=>{setAddSession((pre)=>!pre)}}
                                    className='text-center w-full text-2xl p-2 bg-blue-600 text-white rounded-xl mt-4  transform hover:bg-blue-700 hover:translate-y-1 duration-500 shadow-md cursor-pointer shadow-blue-600'    
                                    >    
                                    {weaklyProgress===100? "Sessions Done"  : "Add Session "}
                                        
                                    </button></div>
                                <div className='text-center text-2xl p-2 bg-blue-600 text-white rounded-xl mt-4  transform hover:bg-blue-700 hover:translate-y-1 duration-500 shadow-md cursor-pointer shadow-blue-600'
                                onClick={()=>{setAddMesure(prev => !prev)}}
                                >
                                    Add Mesure</div>    
                        </div>

                    </div>

                    <div>

                    </div>
            </div>
        </div>
         <hr className='my-6 border-gray-300'/>                                   
        <div className='flex justify-between  p-4'>
            

            {/* Mesure */}
    
            <div className='w-3/5 flex justify-start items-center mx-auto  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4'>
                {Object.keys(last_mesure).length > 0 ? (
                    measurementKeys.map((key) => (
                        <div 
                            key={key} 
                            className='w-full h-32 bg-blue-700 rounded-3xl text-center flex flex-col justify-center items-center text-white text-xl transform hover:bg-blue-800 hover:scale-105 hover:-translate-y-3 duration-500 transition-all'
                        > 
                            <div className='font-bold capitalize'>{key==="bmi_category"? "bmi category":key}</div>
                            <div className='text-3xl mt-2'>{last_mesure[key]? last_mesure[key] : 'NA'}</div>
                        </div>
                    ))
                ) : (
                    <div>No mesure data available.</div>
                )}
            </div>
            {/* Goal Progress */}
            <div className='w-2/5 flex-col justify-center items-center p-4  rounded-3xl shadow-lg border border-gray-300 space-y-2'>
                {goal.target_value?  (<>  <div className='text-2xl font-semibold text-center'>Your Goal : <span className='capitalize'>{goal.title? goal.title : ""}</span></div>
                <div className='text-xl font-medium text-center'>Target Value : {goal.target_value? goal.target_value:""} kg</div>
                 </>)
                :
                (<div className='text-2xl font-semibold text-center'>Set Your Goal And Challenge Your Self</div>)
                }
                <div className='text-2xl font-semibold'>Progess - {goal_progress}%</div>
                <div className="w-full bg-gray-300 rounded-full h-4 ">
                    <div 
                        className={`h-4 rounded-full transition-all duration-500 ${
                            goal_progress >= 75 ? 'bg-green-500' :
                            goal_progress >= 50 ? 'bg-yellow-400' :
                            goal_progress >= 25 ? 'bg-orange-500' :
                            'bg-red-500'
                        }`}
                        style={{ width: `${goal_progress}%` }}
                    ></div>
                </div>
                {!goal.target_value &&
                    <div className='text-center text-2xl bg-blue-600 p-1 mt-1 text-white rounded-2xl transform hover:bg-blue-700 hover:translate-y-1 cursor-pointer'
                    onClick={()=>{setAddGoal(prev => !prev)}}
                    >Add Goal</div>
                }
            </div>

        </div> 
                                            
            
            
            
              
    

        <div className='text-center text-4xl font-semibold'>Our Programme</div>

        <div className='w-5/6 flex justify-center items-center mx-auto  grid-cols-5 gap-10 p-4'>
            {sessions? sessions.map((session,index) => (
                //Session(session,index)
                <Session key={index} session={session} />
            )) : Session([],0)}
        </div>

                                          


    </>
  )
}

export default Dashbourd_user