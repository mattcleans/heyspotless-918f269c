
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { create } from "zustand";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import IndexPage from "@/pages/Index";
import ClientsPage from "@/pages/clients";
import SchedulePage from "@/pages/schedule";
import QuotesPage from "@/pages/quotes";
import MessagesPage from "@/pages/messages";
import AuthPage from "@/pages/auth";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  userType: 'staff' | 'customer' | null;
  setAuth: (userId: string | null, userType: 'staff' | 'customer' | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  userType: null,
  setAuth: (userId, userType) => 
    set({ isAuthenticated: !!userId, userId, userType }),
}));

// Type guard to check if the user type is valid
function isValidUserType(type: string | null): type is 'staff' | 'customer' {
  return type === 'staff' || type === 'customer';
}

function App() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Check initial auth state
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch user profile to get user type
        const { data } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        const userType = data?.user_type || null;
        if (isValidUserType(userType)) {
          setAuth(session.user.id, userType);
        } else {
          setAuth(null, null);
          console.error('Invalid user type received:', userType);
        }
      } else {
        setAuth(null, null);
      }
    };
    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (session?.user) {
        // Fetch user profile to get user type
        const { data } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        const userType = data?.user_type || null;
        if (isValidUserType(userType)) {
          setAuth(session.user.id, userType);
        } else {
          setAuth(null, null);
          console.error('Invalid user type received:', userType);
        }
      } else {
        setAuth(null, null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/auth" 
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage />
            )
          } 
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        >
          <Route index element={<IndexPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="quotes" element={<QuotesPage />} />
          <Route path="messages" element={<MessagesPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
