import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/forgotPassaword";
import Register from "./pages/register";
import Login from "./pages/login";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/lib/auth";
import { Questionnaire } from "@/components/Questionnaire";
import { PageTransition } from "@/components/PageTransition";

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

function AnimatedRoutes() {
  const location = useLocation();
  const [userdata, setUserdata] = useState<User | null>(() => {
    const token = getAuthToken();
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      return JSON.parse(savedUser);
    }
    return null;
  });

  useEffect(() => {
    if (userdata) {
      localStorage.setItem('user', JSON.stringify(userdata));
    } else {
      localStorage.removeItem('user');
    }
  }, [userdata]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          <PageTransition>
            <Login user={userdata} setUserdata={setUserdata}/>
          </PageTransition>
        } />
        <Route path="/register" element={
          <PageTransition>
            <Register />
          </PageTransition>
        } />
        <Route path="/forgot-password" element={
          <PageTransition>
            <ForgotPassword />
          </PageTransition>
        } />
        <Route path="/questionnaire" element={
          <PageTransition>
            <Questionnaire />
          </PageTransition>
        } />
        <Route element={<PrivateRoute user={userdata}/>}>
          <Route path="/" element={
            <PageTransition>
              <Index />
            </PageTransition>
          }/>
          <Route path="*" element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          } />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

const App = () => { 
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;