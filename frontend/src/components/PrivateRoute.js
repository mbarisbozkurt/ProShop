import React from 'react';
import { Outlet, Navigate} from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  //if user logged in, then he/she can go to /shipping, else he/she cannot 
  const userInfo = useSelector((state) => state.auth.userInfo);
  return userInfo ? <Outlet/> : <Navigate to="/login" replace />; //replace for past history
}

export default PrivateRoute;