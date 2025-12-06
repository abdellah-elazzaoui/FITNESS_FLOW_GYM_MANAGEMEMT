import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api';
import {toast} from 'react-toastify';
const AddGoal = ({setAddGoal}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    async function OnSubmit(data) {
        console.log(data);
        try{
            const response = await api.post("create_goal/",data); 
            //console.log(response);
            toast.success("Goal added successfully",{
                autoClose:1500,
                positions:"top-right:"
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
            setAddGoal(false);


        }
        catch(err){
            //console.log(err.message)
            const error_message =err?.response?.data?.error || "Failed to Set Your Goal. Please try again.";
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
                    <h2 className='text-xl font-semibold text-gray-800'>Create Your Goal</h2>
                    <p className='text-sm text-gray-600 mt-1'>Challenge Your Self</p>
                </div>
                
                <form className='p-6 space-y-5' onSubmit={handleSubmit(OnSubmit)}>
                    {/* Session Type */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-700 uppercase tracking-wide'>
                            Goal Type
                        </label>
                        <select 
                            className='w-full px-3 py-2.5 border border-gray-400 rounded 
                                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                     bg-white text-gray-800 font-medium'
                            {...register('goal_type', {
                                required: "Goal type is required"
                            })}
                        >
                            <option value="weight_loss"> Weight Loss</option>
                            <option value="muscle_gain"> Muscle Gain</option>
                            <option value="endurance"> Endurance</option>
                            <option value="flexibility"> Flexibility</option>
                        </select>
                        {errors.goal_type && (
                            <p className='text-red-600 text-xs font-medium mt-1'>{errors.goal_type.message}</p>
                        )}
                    </div>

                    

                    
                    

                    {/* Title */}
                    <div className='space-y-2'>
                        <div className='flex justify-between items-center'>
                            <label className='block text-sm font-medium text-gray-700 uppercase tracking-wide'>
                                Goal Title
                            </label>
                            <span className='text-xs text-gray-500'>Optional</span>
                        </div>
                        <input 
                            type="text"
                            className='w-full px-3 py-2.5 border border-gray-400 rounded 
                                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                     bg-white text-gray-800 resize-none font-medium'
                            rows="3"
                            placeholder="Give your goal a title"
                            {...register('title', {
                                maxLength: {
                                    value: 20,
                                    message: "Maximum 20 characters"
                                }
                            })}
                        />
                        {errors.title && (
                            <p className='text-red-600 text-xs font-medium mt-1'>{errors.title.message}</p>
                        )}
                    </div>

                    {/* Current Weight */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-700 uppercase tracking-wide'>
                            Current Weight
                        </label>
                        <input
                            type="number" 
                            placeholder='(Kg)'
                            className='w-full px-3 py-2.5 border border-gray-400 rounded 
                                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                     bg-white text-gray-800 font-medium'
                            {...register('current_value', {
                                required: "Weight Mesure is required",
                                min: {value:1, message:"Weight must be positive number"}
                            })}
                        />
                        {errors.current_value && (
                            <p className='text-red-600 text-xs font-medium mt-1'>{errors.current_value.message}</p>
                        )}
                    </div>

                    {/* Target Weight */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-700 uppercase tracking-wide'>
                            Target Weight
                        </label>
                        <input
                            type="number" 
                            placeholder='(Kg)'
                            className='w-full px-3 py-2.5 border border-gray-400 rounded 
                                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                     bg-white text-gray-800 font-medium'
                            {...register('target_value', {
                                required: "Target Weight Mesure is required",
                                min: {value:1, message:"Weight must be positive number"}
                            })}
                        />
                        {errors.target_value && (
                            <p className='text-red-600 text-xs font-medium mt-1'>{errors.target_value.message}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className='flex space-x-3 pt-4 border-t border-gray-200'>
                        <button 
                            type="button"
                            onClick={() => setAddGoal(pre => !pre)}
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

export default AddGoal