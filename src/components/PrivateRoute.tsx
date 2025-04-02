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
  // Only check the auth token, as it's the source of truth
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}