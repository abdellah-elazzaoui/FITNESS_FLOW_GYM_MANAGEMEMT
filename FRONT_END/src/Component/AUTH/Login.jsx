import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { Eye, EyeOff, Lock, User, Dumbbell } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Spinner from '../UI/Spinner'

const Login = ({ setIsAuthenticated ,setUser}) => {
    const { register, handleSubmit, formState } = useForm();
    const { errors, isSubmitting } = formState;
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const [Loading, SetLoading] = useState(false);

    async function SubmitData(data) {
        try {
            SetLoading(true);
            setError("");
            setSuccess("");
            
            const response = await api.post("login_user/", data);
            
            // Fixed: Match the key names from your backend response
            localStorage.setItem("access_token", response.data.token.access); // Fixed: was "access"
            localStorage.setItem("refresh_token", response.data.token.refresh); // Fixed: was "refresh"
            
            // Also store user data if needed
            if (response.data.user) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setUser(response.data.user);
            }
            
            toast.success("Login successful", { // Fixed typo: "logging secessfully"
                autoClose: 1000,
                position: "top-right"
            });
            
            setIsAuthenticated(true);
            setSuccess("Login successful");
            
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (err) {
            console.log("Login error:", err);
            const err_message = err?.response?.data?.error || "Login Failed";
            setError(err_message);
            toast.error(err_message, {
                position: "top-right",
                autoClose: 1000
            });
            setIsAuthenticated(false);
        } finally {
            SetLoading(false);
        }
    }
    if(Loading){
        return(
            <div>
                <Spinner />
            </div>
        )
    }

  return (
    <div className='flex justify-between mx-auto items-center  h-auto  w-full  shadow-blue-600 shadow-xl'>
        <div className='w-1/2 h-screen bg-blue-600 flex-col justify-center items-center gap-10 p-4 rounded-r-full hidden md:flex'>
                <div className='text-3xl text-white font-bold text-center'>Challenge Your Self</div>
                <div className='text-3xl text-white font-bold text-center'>Transform Your Body, Mind & Energy</div>
        </div>
        
        <div className='w-1/3 pl-2 flex justify-center items-center mx-auto flex-col '>
            <form onSubmit={handleSubmit(SubmitData)} className='w-full border-2 pt-10 pb-10 px-6 rounded-3xl shadow-lg shadow-blue-600/20'>
                <div className='text-blue-600 text-2xl font-bold text-center'>Login</div>
                
                {error && <div className='text-center text-lg text-red-500'> {error} </div>}
                {success && <div className='text-center text-lg text-green-500'> {success} </div>}
                
                <div>
                    <div className='p-1 text-xl text-blue-600 font-semibold'>username</div>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <User className='text-blue-600'/>
                        </div>
                        <input 
                            type="text" 
                            className={`block w-full pl-10 pr-3 py-3 border rounded-xl border-blue-600 placeholder-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all`}
                            placeholder='username'
                            {...register("username",{
                                required:"username is required",
                                min:{
                                    value:6,
                                    message:"username must be more than 6 characters"
                                }
                            })}
                        />
                    </div>
                    {errors?.username?.message && <div className='text-red-500 pl-2'>{errors.username.message}</div>}
                </div>

                <div>
                    <div className='text-xl font-semibold p-1 text-blue-600'>password</div>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <Lock className='text-blue-600'/>
                        </div>
                        
                        <input 
                            type={showPassword ? "text" : "password"}
                            className={`block w-full pl-10 pr-3 py-3 border rounded-xl border-blue-600 placeholder-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all`}
                            placeholder='password'
                            {...register("password",{
                                required:"password is required",
                                min:{
                                    value:8,
                                    message:"password must be more than 8 characters" // Fixed: was "username" changed to "password"
                                }
                            })}
                        />
                        
                        <div className='absolute inset-y-0 right-0 flex items-center'>
                            <button
                                type="button" // Added type="button" to prevent form submission
                                onClick={() => setShowPassword(prev => !prev)}
                                className='pr-3'
                            >
                                {showPassword ? 
                                    <Eye className='text-blue-600'/> : 
                                    <EyeOff className='text-blue-600'/>
                                }
                            </button>
                        </div>
                    </div>
                    {errors?.password?.message && <div className='text-red-500 pl-2'>{errors.password.message}</div>}
                </div>
                
                <div className='text-center pt-4'>
                    <button 
                        type='submit'
                        className='text-white bg-blue-600 p-2 text-2xl font-semibold w-full rounded-xl transform hover:bg-blue-700 hover:-translate-y-1'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
                <div className='text-gray-600 p-2'>
                you do not have an account? <Link to='/register' className="text-blue-600 font-semibold">register</Link>
            </div>
            </form>
            
            
        </div>

        
    </div>
  )
}

export default Login