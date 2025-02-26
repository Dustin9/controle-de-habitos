import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
export default function PrivateRoute({ children, ...rest }: any) 
{
  const navigate = useNavigate();
  return rest.user ? <Outlet /> : <Navigate to="/login" replace />;

}