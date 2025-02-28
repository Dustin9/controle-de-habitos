import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";

interface User {   
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface PrivateRouteProps {
  user: User | null;
}

export default function PrivateRoute({ user }: PrivateRouteProps) {
  // Check both the user object and the auth token
  const isAuthorized = user && isAuthenticated();
  
  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}