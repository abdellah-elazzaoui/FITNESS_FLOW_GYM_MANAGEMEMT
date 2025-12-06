import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api';
import {toast} from 'react-toastify';
const AddMesure = ({last_mesure, setAddMesure }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({defaultValues:{
        weight: last_mesure.weight || '',
        height: last_mesure.height || ''
    }});
    
    async function OnSubmit(data) {
        console.log(data);
        try{
            const response = await api.post("add_mesure/",data);
            console.log(response);
            toast.success("Mesure added successfully",{
                autoClose:1500,
                positions:"top-right:"
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
            setAddMesure(false);


        }
        catch(err){
            console.log(err.message)
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
                    <h2 className='text-xl font-semibold text-gray-800'>Log New Mesure</h2>
                    <p className='text-sm text-gray-600 mt-1'>Track your Weight progress</p>
                </div>
                
                <form className='p-6 space-y-5' onSubmit={handleSubmit(OnSubmit)}>
                    {/* Weight*/}
                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-700 uppercase tracking-wide'>
                            Weight
                        </label>
                        <input
                            type="number" 
                            placeholder='(Kg)'
                            className='w-full px-3 py-2.5 border border-gray-400 rounded 
                                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                     bg-white text-gray-800 font-medium'
                            {...register('weight', {
                                required: "Weight Mesure is required",
                                min: {value:1, message:"Weight must be positive number"}
                            })}
                        />
                        {errors.type && (
                            <p className='text-red-600 text-xs font-medium mt-1'>{errors.type.message}</p>
                        )}
                    </div>

                    

                    
                    

                    {/* Height */}
                    <div className='space-y-2'>
                        <div className='flex justify-between items-center'>
                            <label className='block text-sm font-medium text-gray-700 uppercase tracking-wide'>
                               Height
                            </label>
                        </div>
                        <input 
                            
                            className='w-full px-3 py-2.5 border border-gray-400 rounded 
                                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                     bg-white text-gray-800 resize-none font-medium'
                            type="number"
                            placeholder="(cm)"
                            disabled={last_mesure?.height ? true:false}
                            {...register('height', {
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
                            onClick={() => setAddMesure(pre => !pre)}
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
                            Save Mesure
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddMesure