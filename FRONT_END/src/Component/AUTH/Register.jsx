import React, { useState } from 'react'
import {useForm, useWatch, Watch} from 'react-hook-form'
import {useNavigate} from 'react-router-dom'
import { Eye, EyeOff, User, Mail, Phone, Calendar, Lock, Dumbbell } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../api' 
import { toast } from 'react-toastify'
const Register = () => {
  const { register, handleSubmit, formState, reset, control } = useForm()
  const { errors, isSubmitting } = formState
  const password = useWatch({ control, name: "password" })
  const [error,setError] = useState("");
  const [succes,setSuccess] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  
  const inputClassName = (hasError) => 
        `w-full px-4 py-3 pl-11  border rounded-xl focus:outline-none focus:ring-2 transition-all ${
            hasError 
                ? 'border-red-500 focus:ring-red-200' 
                : 'border-blue-500 focus:border-blue-500 border-2 focus:ring-blue-400'
        }`

  async function SubmitData(data) {
    //console.log(data);
    try{
      setError("");
      setSuccess("");
      const response = await api.post("register_user/",data);
      console.log(response);
      toast.success("Account created successfully",{
        autoClose:1000,
        position:"top-right"
      });
      setSuccess("Account created successfully")

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    }
    catch(err){
      console.log(err.response);
      const error_message = err?.response?.data?.error || "ERROR";
      setError(error_message);
      toast.error(error_message,{
        autoClose:1000,
        position:"top-right"
      });
    }
    

  }      

  return (
    <div className='w-full h-auto flex justify-between'>
      <div className='w-3/5   justify-center items-center '>
        
              <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                            <Dumbbell className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-gray-900 italic">
                            FITNESS <span className="text-blue-600">FLOW</span>
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Créer votre compte
                    </h2>
                    <p className="mt-1 text-lg text-gray-600">
                        Rejoignez notre communauté et commencez votre transformation
                    </p>
              </div>

        <div className='flex justify-center w-full'>
            
            <form action="" onSubmit={handleSubmit(SubmitData)} className='w-3/4 mb-10  space-y-6 pb-10 border-2 p-4 rounded-3xl shadow-lg shadow-gray-600/20'>
            <div className='text-center text-2xl font-semibold'>Register</div>
            {error && <div className='text-center text-red-500 text-xl font-medium'> {error} </div>}
            {succes && <div className='text-center text-green-500 text-xl font-medium'> {succes} </div>}
              <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                  <div className='relative'>
                    <div className='absolute  left-0 flex justify-center items-center mx-auto pl-2 pt-3 '>
                        <User className='text-blue-600'/>
                    </div>
                    <input type="text" 
                    placeholder='Abdellah'
                    className={inputClassName(errors.username)}
                    {...register("username",{
                      required:"username is required",
                      min:{
                        value:6,
                        message:"username must be at least 6 characters"
                      }
                    })}
                    />
                    {errors?.username && (
                                    <p className="mt-2 pl-2 text-sm text-red-600">{errors.username.message}</p>
                                )}
                  </div>
              </div>
                  
              <div className='flex'>
                  <div className='pr-2 w-1/2'>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <div className='relative'>
                      <div className='absolute  left-0 flex justify-center items-center mx-auto pl-2 pt-3 '>
                        <User className='text-blue-600'/>
                    </div>
                      <input type="text" 
                      placeholder='First Name'
                      className={inputClassName(errors.date_of_birth)}
                      {...register("first_name",{
                      required:"first name is required",
                    })}
                    />
                    {errors?.first_name && (
                                    <p className="mt-2 pl-2 text-sm text-red-600">{errors.first_name.message}</p>
                                )}

                    </div>
                  </div>
                  
                  <div className='pl-2 w-1/2'>
                    <label htmlFor="last_name"className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <div className='relative'>
                      <div className='absolute  left-0 flex justify-center items-center mx-auto pl-2 pt-3 '>
                        <User className='text-blue-600'/>
                    </div>
                      <input type="text"
                      placeholder='Last Name'
                      className={inputClassName(errors.date_of_birth)}
                      {...register("last_name",{
                      required:"last name is required",
                    })}
                      />
                      {errors?.last_name && (
                                    <p className="mt-2 pl-2 text-sm text-red-600">{errors.last_name.message}</p>
                                )}
                    </div>
                  </div>
              </div>
                  
              <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">email *</label>
                  <div className='relative'>
                    <div className='absolute  left-0 flex justify-center items-center mx-auto pl-2 pt-3 '>
                        <Mail className='text-blue-600'/>
                    </div>
                    <input type="email" 
                    placeholder='user@gmail.com'
                    className={inputClassName(errors.date_of_birth)}
                    {...register("email",{
                      required:"password is required",
                      pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Adresse email invalide"
                              }

                    })}
                    />
                    {errors?.email && (
                                    <p className="mt-2 pl-2 text-sm text-red-600">{errors.email.message}</p>
                                )}
                  </div>
              </div>

                {/* Phone Number Field */}
              <div className='w-full flex grid-cols-2 gap-4'>
                <div className='w-1/2'>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <input
                        type="tel"
                        id="phone"
                        
                        className={inputClassName(errors.date_of_birth)}
                        placeholder="+212 612345678"
                        {...register("phone", {
                            required: "Le numéro de téléphone est requis",
                            pattern: {
                                value: /^[\+]?[1-9][\d]{0,15}$/,
                                message: "Veuillez entrer un numéro de téléphone valide"
                            },
                            minLength: {
                                value: 10,
                                message: "phone number must have at least 10 characters"
                            },
                            maxLength:{
                              value:13,
                              message: "phone number must not have more than 10 characters"
                            }
                        })}
                    />
                </div>
                {errors?.phone_number && (
                    <p className="mt-2 text-sm text-red-600">{errors.phone_number.message}</p>
                    )}
              </div>


              {/* Date of Birth Field */}
              <div className='w-1/2'>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance *
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <input
                        type="date"
                        id="birthday"
                        className={inputClassName(errors.date_of_birth)}
                        {...register("birthday", {
                            required: "La date de naissance est requise",
                            validate: {
                                validAge: (value) => {
                                    if (!value) return "La date de naissance est requise"
                                    
                                    const today = new Date()
                                    const birthDate = new Date(value)
                                    const age = today.getFullYear() - birthDate.getFullYear()
                                    const monthDiff = today.getMonth() - birthDate.getMonth()
                                    
                                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                                        return age - 1 >= 16 || "Vous devez avoir au moins 16 ans"
                                    }
                                    return age >= 16 || "Vous devez avoir au moins 16 ans"
                                }
                            }
                        })}
                    />
                </div>
                {errors?.date_of_birth && (
                    <p className="mt-2 text-sm text-red-600">{errors.date_of_birth.message}</p>
                  )}
              </div>
              </div>


              {/* Password */}    
              <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">password *</label>
                  <div className='relative'>
                    <div
                    type="button"
                    onClick={()=>setShowPassword(prev => !prev)}
                    >
                      {showPassword?
                      (<div className='absolute  left-0 flex justify-center items-center mx-auto p-2 pt-3'>
                          <Eye className='text-blue-600'/>
                      </div>):
                      (<div className='absolute  left-0 flex justify-center items-center mx-auto p-2 pt-3'>
                          <EyeOff className='text-blue-600'/>
                      </div>)
                      } 
                    </div>
                    <input type={showPassword? "text":"password"}
                    name='password'
                    placeholder='enter your password'
                    className={inputClassName(errors.date_of_birth)}
                    {...register("password",{
                      required:"password is required",
                      min:{
                        value:6,
                        message:"password must be at least 6 characters"
                      },
                      pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                message: "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
                              }
                      
                    })}
                    />
                    {errors?.password && (
                                    <p className="mt-2 pl-2 text-sm text-red-600">{errors.password.message}</p>
                                )}
                  </div>
              </div>
                  
              <div>
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">comfirm password *</label>
                  <div className='relative'>
                    <div
                    type="button"
                    onClick={()=>setShowConfirmPassword(prev => !prev)}
                    >
                      {showConfirmPassword?
                      (<div className='absolute  left-0 flex justify-center items-center mx-auto p-2 pt-3'>
                          <Eye className='text-blue-600'/>
                      </div>):
                      (<div className='absolute  left-0 flex justify-center items-center mx-auto p-2 pt-3'>
                          <EyeOff className='text-blue-600'/>
                      </div>)
                      } 
                    </div>
                    <input type={showConfirmPassword? "text":"password"}
                    placeholder='confirm your password'
                    className={inputClassName(errors.date_of_birth)}
                    {...register("comfirm_password",{
                      required:"please comfirm your password",
                      validate: (value) => value === password || "passwords are not mutch"
                    })}
                    />
                    {errors?.comfirm_password && (
                                    <p className="mt-2 pl-2 text-sm text-red-600">{errors.comfirm_password.message}</p>
                                )}
                  </div>
              </div>
                  
              <div className='w-full bg-blue-600 text-center p-2 mt-4 rounded-2xl cursor-pointer transform hover:bg-blue-700 hover:-translate-y-1'>
                <button type="submit" className='text-white font-bold text-2xl ' disabled={isSubmitting} >
                  {isSubmitting? "Submiting": "Submit"}
                  
                </button>
              </div>
              <div className='text-gray-600 p-2 text-center '>Already have an account? <Link to='/login' className="text-blue-600 font-semibold">login</Link> </div>
            </form>
            
          </div>  
        
      </div>

        <div className="hidden lg:block flex-1 relative bg-gradient-to-br from-blue-700 to-blue-500">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative flex flex-col justify-center items-center h-full text-white p-12">
                <div className="max-w-md text-center">
                    <Dumbbell className="w-24 h-24 mx-auto mb-8 opacity-90" />
                    <h3 className="text-4xl font-bold mb-6">
                        Your Transformation Starts Here
                    </h3>
                    <p className="text-xl opacity-90 leading-relaxed mb-8">
                        Join thousands of members who have already transformed their lives through our motivating community and personalized programs.
                    </p>
                    <div className="space-y-4 text-left">
                        {[
                            "Unlimited access to all equipment",
                            "Personalized training programs", 
                            "Detailed progress tracking",
                            "Supportive and motivating community"
                        ].map((feature, index) => (
                            <div key={index} className="flex items-center space-x-5">
                                <span className="text-lg space-x-5">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default Register
