
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import ClientsPage from "./pages/clients";
import BookingPage from "./pages/schedule";
import QuotePage from "./pages/quotes";
import MessagesPage from "./pages/messages";
import NotFound from "./pages/NotFound";
import { create } from 'zustand';

interface AuthStore {
  userType: 'staff' | 'customer' | null;
  setUserType: (type: 'staff' | 'customer' | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  userType: null,
  setUserType: (type) => set({ userType: type }),
}));

// Function to determine user type based on subdomain
const getUserTypeFromDomain = () => {
  const hostname = window.location.hostname;
  
  // Handle development environment and preview
  if (hostname === 'localhost' || 
      hostname.includes('127.0.0.1') || 
      hostname.includes('lovableproject.com') ||
      hostname.includes('gptengineer.app')) {
    return 'customer'; // Default to customer interface in development
  }
  
  if (hostname.startsWith('staff.')) return 'staff';
  if (hostname.startsWith('portal.')) return 'customer';
  return 'customer'; // Default to customer interface if no subdomain match
};

const ProtectedRoute = ({ children, allowedUserType }: { children: React.ReactNode; allowedUserType: 'staff' | 'customer' | null }) => {
  const userType = useAuthStore((state) => state.userType);
  
  if (userType !== allowedUserType) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const { setUserType } = useAuthStore();

  // Set user type based on subdomain when app loads
  useEffect(() => {
    const userType = getUserTypeFromDomain();
    setUserType(userType);
  }, [setUserType]);

  const queryClient = new QueryClient();
  const userType = useAuthStore((state) => state.userType);

  // Always render the app now, with a default user type
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={
                <ProtectedRoute allowedUserType={userType}>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/clients" element={
                <ProtectedRoute allowedUserType="staff">
                  <ClientsPage />
                </ProtectedRoute>
              } />
              <Route path="/schedule" element={
                <ProtectedRoute allowedUserType={userType}>
                  <BookingPage />
                </ProtectedRoute>
              } />
              <Route path="/quotes" element={
                <ProtectedRoute allowedUserType={userType}>
                  <QuotePage />
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute allowedUserType={userType}>
                  <MessagesPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
