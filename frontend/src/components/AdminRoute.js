import React from 'react';
import { Outlet, Navigate} from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  return userInfo && userInfo.isAdmin ? <Outlet/> : <Navigate to="/login" replace />; 
  //if user is admin, then he/she can navigate whatever is rendered in index.js in AdminRoute
  //else he/she need to login
}

export default AdminRoute;