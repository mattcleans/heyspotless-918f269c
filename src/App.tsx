
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
  userType: 'staff' | 'customer' | 'admin' | null;
  setAuth: (userId: string | null, userType: 'staff' | 'customer' | 'admin' | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  userType: null,
  setAuth: (userId, userType) => 
    set({ isAuthenticated: !!userId, userId, userType }),
}));

function isValidUserType(type: string | null): type is 'staff' | 'customer' | 'admin' {
  return type === 'staff' || type === 'customer' || type === 'admin';
}

function App() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Check initial auth state
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session);

        if (session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .maybeSingle();
          
          console.log("Profile data:", profileData, "Error:", profileError);

          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            setAuth(null, null);
            return;
          }

          const userType = profileData?.user_type || null;
          if (isValidUserType(userType)) {
            console.log("Setting auth state with:", { userId: session.user.id, userType });
            setAuth(session.user.id, userType);
          } else {
            console.error('Invalid user type received:', userType);
            setAuth(null, null);
          }
        } else {
          console.log("No session found, clearing auth state");
          setAuth(null, null);
        }
      } catch (error) {
        console.error("Error in checkAuth:", error);
        setAuth(null, null);
      }
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_OUT') {
        setAuth(null, null);
        return;
      }

      try {
        if (session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .maybeSingle();
          
          console.log("Profile data on auth change:", profileData, "Error:", profileError);

          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            setAuth(null, null);
            return;
          }

          const userType = profileData?.user_type || null;
          if (isValidUserType(userType)) {
            console.log("Setting auth state with:", { userId: session.user.id, userType });
            setAuth(session.user.id, userType);
          } else {
            console.error('Invalid user type received:', userType);
            setAuth(null, null);
          }
        } else {
          console.log("No session in auth change, clearing auth state");
          setAuth(null, null);
        }
      } catch (error) {
        console.error("Error in auth change handler:", error);
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
