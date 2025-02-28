import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/forgotPassaword";
import Register from "./pages/register";
import Login from "./pages/login";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/lib/auth";

const queryClient = new QueryClient();
interface User {   
  "message": string,
  "token": string,
  "user": {
    "id": string,
    "email": string,
    "name": string
  }
}

const App = () => { 
  const [userdata, setUserdata] = useState<User | null>(() => {
    const token = getAuthToken();
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      return JSON.parse(savedUser);
    }
    return null;
  });

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (userdata) {
      localStorage.setItem('user', JSON.stringify(userdata));
    } else {
      localStorage.removeItem('user');
    }
  }, [userdata]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login user={userdata} setUserdata={setUserdata}/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route element={<PrivateRoute user={userdata}/>}>
              <Route path="/" element={<Index />}/>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;