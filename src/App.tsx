import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { create } from "zustand";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import IndexPage from "@/pages/Index";
import ClientsPage from "@/pages/clients";
import SchedulePage from "@/pages/schedule";
import QuotesPage from "@/pages/quotes";
import MessagesPage from "@/pages/messages";
import AuthPage from "@/pages/auth";
import EditProfilePage from "@/pages/profile/EditProfilePage";
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
  const userType = useAuthStore((state) => state.userType);

  useEffect(() => {
    // Initial session check
    const initializeAuth = async () => {
      try {
        console.log("Checking initial session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setAuth(null, null);
          return;
        }

        if (session?.user) {
          console.log("Found existing session for user:", session.user.id);
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error("Profile fetch error:", profileError);
            setAuth(null, null);
            return;
          }

          if (!profileData) {
            console.error("No profile found for user:", session.user.id);
            setAuth(null, null);
            return;
          }

          const userType = profileData.user_type;
          if (isValidUserType(userType)) {
            console.log("Setting auth state with:", {
              userId: session.user.id,
              userType: userType
            });
            setAuth(session.user.id, userType);
          } else {
            console.error("Invalid user type:", userType);
            setAuth(null, null);
          }
        } else {
          console.log("No active session found");
          setAuth(null, null);
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
        setAuth(null, null);
      }
    };

    // Initialize auth state
    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_OUT' || !session) {
        console.log("User signed out or session ended");
        setAuth(null, null);
        return;
      }

      if (session?.user) {
        console.log("Session updated for user:", session.user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          setAuth(null, null);
          return;
        }

        if (!profileData) {
          console.error("No profile found for user:", session.user.id);
          setAuth(null, null);
          return;
        }

        const userType = profileData.user_type;
        if (isValidUserType(userType)) {
          console.log("Updating auth state with:", {
            userId: session.user.id,
            userType: userType
          });
          setAuth(session.user.id, userType);
        } else {
          console.error("Invalid user type:", userType);
          setAuth(null, null);
        }
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [setAuth]);

  const renderProtectedRoute = (element: JSX.Element) => {
    if (userType === 'staff' || userType === 'admin') {
      return element;
    }
    return <AuthPage />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="clients" element={renderProtectedRoute(<ClientsPage />)} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="quotes" element={<QuotesPage />} />
          <Route path="messages" element={renderProtectedRoute(<MessagesPage />)} />
          <Route 
            path="profile/edit" 
            element={isAuthenticated ? <EditProfilePage /> : <AuthPage />} 
          />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
