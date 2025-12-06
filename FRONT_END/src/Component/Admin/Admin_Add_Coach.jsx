import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api';
import { toast } from 'react-toastify';
const Admin_Add_Coach = ({setAdd_Coach , updated_coach}) => {

  const { register, handleSubmit, formState, reset } = useForm({defaultValues:updated_coach});
  const { errors, isSubmitting } = formState;
  
  const specialityOptions = [
    { value: 'cardio', label: 'Cardio' },
    { value: 'strength', label: 'Strength' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'pilates', label: 'Pilates' },
    { value: 'hiit', label: 'HIIT' }
  ];

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const response = await api.post(updated_coach? "admin_update_coach/" :  "admin_add_coach/",data);
      toast.success(response.data.message,{
        autoClose:1500,
        position:"top-right"
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      //console.log(error.message); 
      const error_message = error.response.data.error || "Operation Failed Please Try Again";
      toast.error(error_message,{
        autoClose:1500,
        position:"top-right"
      });
    } 
  };

  



  return (
    <div className='w-full h-screen bg-gray-900/90 items-center flex justify-center mx-auto'>
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{updated_coach? "Update" : "Add New"} Coach</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('username', {
                    required: 'Username is required',
                    maxLength: {
                      value: 50,
                      message: 'Username must be less than 50 characters'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('first_name', {
                      required: 'First name is required',
                      maxLength: {
                        value: 100,
                        message: 'First name must be less than 100 characters'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter first name"
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('last_name', {
                      required: 'Last name is required',
                      maxLength: {
                        value: 100,
                        message: 'Last name must be less than 100 characters'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter last name"
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  {...register('phone', {
                    maxLength: {
                      value: 12,
                      message: 'Phone must be less than 12 characters'
                    },
                    pattern: {
                      value: /^[0-9+\-\s()]*$/,
                      message: 'Please enter a valid phone number'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday
                </label>
                <input
                  type="date"
                  {...register('birthday')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.birthday && (
                  <p className="mt-1 text-sm text-red-600">{errors.birthday.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Speciality <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('speciality', {
                    required: 'Speciality is required'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a speciality</option>
                  {specialityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.speciality && (
                  <p className="mt-1 text-sm text-red-600">{errors.speciality.message}</p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  { updated_coach? (isSubmitting ? 'Updating...' : 'Update Coach'):
                  (isSubmitting ? 'Adding...' : 'Add Coach')}
                </button>

                <button
                  type="button" // Fixed: added type="button" to prevent form submission
                  onClick={()=>{setAdd_Coach(false)}}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button" // Fixed: added type="button" to prevent form submission
                  onClick={() => reset()} // Fixed: added onClick handler
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>  
        </div>
    </div>    
  );
};

export default Admin_Add_Coach;