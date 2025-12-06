import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './Component/UI/MainLayout'
import HomePage from './Component/UI/HomePage'
import Login from './Component/AUTH/Login'
import Register from './Component/AUTH/Register'
import Contact from './Component/UI/Contact'
import About from './Component/UI/About'
import Dashbourd_user from './Component/UI/Dashbourd_user'
import ProtectedRoute from './Component/UI/ProtectedRoute'
import Profile from './Component/UI/Profile'
import Spinner from './Component/UI/Spinner'
import Dashboard_Admin from './Component/Admin/Dashboard_Admin'
import api from './api'
import Subscription from './Component/Admin/Subscription';
import Session from './Component/Admin/Session_Admin';
import Coach from './Component/Admin/Coach';
import Setting from './Component/Admin/Setting';
import { Navigate } from 'react-router-dom';

const App = () => {
  const [IsAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user,setUser] = useState({});

  

  async function get_user_info() {
    try{
      const response = await api.get("get_user_info/");
      setUser(response.data.user);
    }
    catch (err){
      throw new Error(err.message);
    }
    

  }

  useEffect(() => {
    const checkAuthentication = () => {
      setLoading(true);
      const access = localStorage.getItem("access_token");
      const refresh = localStorage.getItem("refresh_token");
      
      //console.log("Auth Check - Access:", !!access, "Refresh:", !!refresh);
      
      if (access && refresh) {
        setIsAuthenticated(true);
        get_user_info();
      } else {
        console.log("No valid tokens found, clearing storage");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    
    checkAuthentication();
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout user={user} IsAuthenticated={IsAuthenticated} setIsAuthenticated={setIsAuthenticated} />}>
            <Route index element={IsAuthenticated? <Navigate to="/dashboard" replace />  : <HomePage />} />
            <Route path='/login' element={<Login setIsAuthenticated={setIsAuthenticated}  setUser={setUser}/>} />
            <Route path='/register' element={<Register />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/about' element={<About />} />
            <Route path='/profile' element={<Profile user={user}/>} />
            
            <Route path='/dashboard' element={
              <ProtectedRoute loading={loading} IsAuthenticated={IsAuthenticated}> 
               { user.is_superuser? <Dashboard_Admin  setIsAuthenticated={setIsAuthenticated}/>  : <Dashbourd_user key={0} user ={user} setUser={setUser}/>}
              </ProtectedRoute>
            } />

            <Route path='/session' element={<Session setIsAuthenticated={setIsAuthenticated} />}/>
            <Route path='/subscription/' element={
                <ProtectedRoute loading={loading} IsAuthenticated={IsAuthenticated}> 
                  <Subscription setIsAuthenticated={setIsAuthenticated}/>
                </ProtectedRoute>
                }/>
            <Route path='/coach' element={
                <ProtectedRoute loading={loading} IsAuthenticated={IsAuthenticated}> 
                    <Coach  setIsAuthenticated={setIsAuthenticated}/> 
                </ProtectedRoute>
            }/>

            <Route path='/setting' element={
                <ProtectedRoute loading={loading} IsAuthenticated={IsAuthenticated}> 
                  <Setting />
                </ProtectedRoute>  
            }/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App