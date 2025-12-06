import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api';
import { toast } from 'react-toastify';

const Admin_Add_Session = ({setAdd_Session,coachs,updated_item}) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({defaultValues:updated_item? updated_item:{}});
    
    async function OnSubmit(data) {
        //console.log(data);
        try{
          const response =  await api.post("admin_add_session/",data) ;
          toast.success(response.data.message,{
            autoClose:1500,
            position:"top-right"
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
        catch(err){
          const err_message = err.response.data.error || "ERROR with adding New Session";
          toast.error(err_message,{
            autoClose:1500,
            position:"top-right"
          });
        }
    }

    async function OnUpdate(data) {
        //console.log(data);
        try{
          const response =  await api.post("admin_update_session/",data) ;
          toast.success(response.data.message,{
            autoClose:1500,
            position:"top-right"
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
        catch(err){
          const err_message = err.response.data.error || "ERROR with Updating Session";
          toast.error(err_message,{
            autoClose:1500,
            position:"top-right"
          });
        }
    }



    
    

    return (
        <div className='fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg w-full max-w-md border border-gray-300 shadow-xl'>
                {/* Header */}
                <div className='bg-gradient-to-tr from-blue-500 to-indigo-700 px-6 py-5 border-b border-gray-300 rounded-t-lg'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h2 className='text-2xl font-bold text-white'>{ updated_item ? "Update a Session" : "Add New Session"}</h2>
                        </div>
                        
                    </div>
                </div>
                
                <form className='p-6 space-y-6' onSubmit={updated_item? handleSubmit(OnUpdate) : handleSubmit(OnSubmit)}>
                    {/* Session Type */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                            <span className='text-red-500 mr-1'>*</span>
                            Session Type
                        </label>
                        <select 
                            className='w-full px-4 py-3 border border-gray-400 rounded-lg 
                                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                                     bg-white text-gray-800 font-medium transition'
                            {...register('type', {
                                required: "Please select a session type"
                            })}
                        >
                            <option value="">Select type...</option>
                            <option value="cardio">🏃‍♂️ Cardio</option>
                            <option value="strength">💪 Strength Training</option>
                            <option value="yoga">🧘‍♀️ Yoga</option>
                            <option value="pilates">🌟 Pilates</option>
                            <option value="hiit">⚡ HIIT</option>
                        </select>
                        {errors.type && (
                            <p className='text-red-600 text-sm font-medium mt-1 flex items-center'>
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                {errors.type.message}
                            </p>
                        )}
                    </div>

                    {/* Coach Selection */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                            <span className='text-red-500 mr-1'>*</span>
                            Coach
                        </label>
                        <select 
                            className='w-full px-4 py-3 border border-gray-400 rounded-lg 
                                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                                     bg-white text-gray-800 font-medium transition'
                            {...register('coach', {
                                required: "Please select a coach"
                            })}
                        >
                            <option value="">Select coach...</option>
                            {coachs.map(coach => (
                                <option key={coach.id} value={coach.id}>
                                    {coach.first_name} {coach.last_name} - {coach.speciality}
                                </option>
                            ))}
                        </select>
                        {errors.coach && (
                            <p className='text-red-600 text-sm font-medium mt-1'>{errors.coach.message}</p>
                        )}
                    </div>

                    {/* Day and Time Row */}
                    <div className='grid grid-cols-2 gap-4'>
                        {/* Day */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                                <span className='text-red-500 mr-1'>*</span>
                                Day
                            </label>
                            <select 
                                className='w-full px-4 py-3 border border-gray-400 rounded-lg 
                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                                         bg-white text-gray-800 font-medium transition'
                                {...register('day', {
                                    required: "Please select a day"
                                })}
                            >
                                <option value="">Select day...</option>
                                <option value="monday">Monday</option>
                                <option value="tuesday">Tuesday</option>
                                <option value="wednesday">Wednesday</option>
                                <option value="thursday">Thursday</option>
                                <option value="friday">Friday</option>
                                <option value="saturday">Saturday</option>
                            </select>
                            {errors.day && (
                                <p className='text-red-600 text-sm font-medium mt-1'>{errors.day.message}</p>
                            )}
                        </div>

                        {/* Time */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                                <span className='text-red-500 mr-1'>*</span>
                                Time
                            </label>
                            <input 
                                type="time"
                                className='w-full px-4 py-3 border border-gray-400 rounded-lg 
                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                                         bg-white text-gray-800 font-medium transition'
                                {...register('time', {
                                    required: "Please select a time"
                                })}
                            />
                            {errors.time && (
                                <p className='text-red-600 text-sm font-medium mt-1'>{errors.time.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Duration */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                            <span className='text-red-500 mr-1'>*</span>
                            Duration (minutes)
                        </label>
                        <div className='relative'>
                            <input 
                                type="number"
                                min="15"
                                max="240"
                                step="15"
                                placeholder="e.g., 60"
                                className='w-full px-4 py-3 border border-gray-400 rounded-lg 
                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                                         bg-white text-gray-800 font-medium transition pr-12'
                                {...register('duration', {
                                    required: "Please enter duration",
                                    min: {
                                        value: 15,
                                        message: "Minimum duration is 15 minutes"
                                    },
                                    max: {
                                        value: 240,
                                        message: "Maximum duration is 240 minutes"
                                    }
                                })}
                            />
                            <span className='absolute right-4 top-3.5 text-gray-500 font-medium'>min</span>
                        </div>
                        {errors.duration && (
                            <p className='text-red-600 text-sm font-medium mt-1'>{errors.duration.message}</p>
                        )}
                    </div>

                    

                    {/* Form Footer */}
                    <div className='pt-6 border-t border-gray-200'>
                        <div className='text-xs text-gray-500 mb-4'>
                            <span className='text-red-500'>*</span> Required fields
                        </div>
                        
                        {/* Buttons */}
                        <div className='flex space-x-3'>
                            <button 
                                type="button"
                                onClick={()=>{setAdd_Session(false)}}
                                className='flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 
                                         font-semibold rounded-lg hover:bg-gray-50 transition duration-150
                                         focus:ring-2 focus:ring-gray-200'
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                                         font-semibold rounded-lg transition duration-150
                                         focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                                         ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-700'}`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </span>
                                ) : updated_item? 'Update':'Create Session'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Admin_Add_Session;