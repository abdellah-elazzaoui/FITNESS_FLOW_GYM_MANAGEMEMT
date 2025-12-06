import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api';
import {toast} from 'react-toastify';
const AddSession = ({weaklyProgress, setAddSession }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    async function OnSubmit(data) {
        console.log(data);
        try{
            const response = await api.post("add_session/",data);
            //console.log(response);
            toast.success("Session added successfully",{
                autoClose:1500,
                positions:"top-right:"
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
            setAddSession(false);

        }
        catch(err){
            //console.log(err.message)
            const error_message =err?.response?.data?.error || "Failed to add session. Please try again.";
            toast.error(error_message,{
                autoClose:1500,
                position:"top-right"
            });
        }
    }

    return (
        <div className='fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg w-full max-w-md border border-gray-300 shadow-lg'>
                {/* Header */}
                <div className='bg-gray-50 px-6 py-4 border-b border-gray-300 rounded-t-lg'>
                    <h2 className='text-xl font-semibold text-gray-800'>Log New Session</h2>
                    <p className='text-sm text-gray-600 mt-1'>Track your workout progress</p>
                </div>
                
                <form className='p-6 space-y-5' onSubmit={handleSubmit(OnSubmit)}>
                    {/* Session Type */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-700 uppercase tracking-wide'>
                            Session Type
                        </label>
                        <select 
                            className='w-full px-3 py-2.5 border border-gray-400 rounded 
                                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                     bg-white text-gray-800 font-medium'
                            {...register('type', {
                                required: "Session type is required"
                            })}
                        >
                            <option value="cardio">🏃‍♂️ Cardio</option>
                            <option value="strength">💪 Strength</option>
                            <option value="yoga">🧘‍♀️ Yoga</option>
                            <option value="pilates">🌟 Pilates</option>
                            <option value="hiit">⚡ HIIT</option>
                        </select>
                        {errors.type && (
                            <p className='text-red-600 text-xs font-medium mt-1'>{errors.type.message}</p>
                        )}
                    </div>

                    

                    
                    

                    {/* Note */}
                    <div className='space-y-2'>
                        <div className='flex justify-between items-center'>
                            <label className='block text-sm font-medium text-gray-700 uppercase tracking-wide'>
                                Session Notes
                            </label>
                            <span className='text-xs text-gray-500'>Optional</span>
                        </div>
                        <textarea 
                            className='w-full px-3 py-2.5 border border-gray-400 rounded 
                                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                     bg-white text-gray-800 resize-none font-medium'
                            rows="3"
                            placeholder="Record any observations, achievements, or areas for improvement..."
                            {...register('note', {
                                maxLength: {
                                    value: 150,
                                    message: "Maximum 150 characters"
                                }
                            })}
                        />
                        {errors.note && (
                            <p className='text-red-600 text-xs font-medium mt-1'>{errors.note.message}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className='flex space-x-3 pt-4 border-t border-gray-200'>
                        <button 
                            type="button"
                            onClick={() => setAddSession(pre => !pre)}
                            className='flex-1 px-4 py-2.5 border border-gray-400 text-gray-700 
                                     font-medium rounded hover:bg-gray-50 transition duration-150'
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className='flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium 
                                     rounded hover:bg-blue-700 transition duration-150
                                     focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
                        >
                            Save Session
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddSession