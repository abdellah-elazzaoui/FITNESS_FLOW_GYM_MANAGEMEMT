import React from 'react'
import { Navigate } from 'react-router-dom';
import Spinner from './Spinner';
const ProtectedRoute = ({loading, children, IsAuthenticated }) => {
  if (loading){
    return(
      <Spinner />
    )
  }
  return (
    IsAuthenticated ? children : <Navigate to='/login' replace />
  );
}

export default ProtectedRoute;
