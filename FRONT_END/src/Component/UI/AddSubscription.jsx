import React from 'react'
import { Form, useForm } from 'react-hook-form'
import api from '../../api';
import { toast } from 'react-toastify';
const AddSubscription = () => {
  const {register,handleSubmit,formState} = useForm();
  const {errors,isSubmitting} = formState;

  async function Submitplan(data) {
    //console.log(data);
    const confirm = window.confirm("Are you sure yiu want to make this subscription ?");
    if(confirm){
      try{
        const response = await api.post("add_subscription/",data);
        const message = response.data.message || "Welcome to Fitness Flow";
        toast.success(message,{
          position:'top-right',
          autoClose:1500
        })
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
      catch(err){
        const message = err.response.data.error || "ERROR with your Operation";
        toast.error(message,{
          position:"top-right",
          autoClose:1500
        })
      }
    }
  }

  return (
    <div>
      <form className='flex-col space-y-5 border-2 p-4 shadow-lg overflow-y-auto rounded-xl' onSubmit={handleSubmit(Submitplan)}>
        <div className='text-2xl font-semibold text-center'>Choose a Subscription</div>
        <div>
          <select name="subscription" id="subscription" 
          className='w-80 text-center text-2xl font-semibold border-2 border-gray-600 rounded-lg'
          {...register("plan",{
            required:"please select a plan"
          })}
          >
            <option value="3_months"  > 3 Months - 400 DH </option>
            <option value="6_months"  >6 Months - 700 DH</option>
            <option value="12_months" >12 Months - 1300 DH</option>
          </select>
          
        </div>
        {errors?.plan &&
          <div className='text-red-500'>{errors.plan.message}</div>
          }
        <div>
        <button type="submit" className=' w-full text-center bg-blue-600 text-white text-2xl p-1 font-semibold rounded-xl 
        transform hover:bg-blue-700 hover:scale-105'>Validate</button>
        </div>
      </form>
    </div>
  )
}

export default AddSubscription
