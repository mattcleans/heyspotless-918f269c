
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "./use-toast";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userId, userType, setAuth, clearAuth } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // First set up the auth listener before checking the session
        // This prevents race conditions
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log(`Auth state changed: ${event}`, session?.user?.id);
            
            // Update our local user state
            setUser(session?.user || null);
            
            // For the other operations that need to query Supabase,
            // use setTimeout to avoid potential deadlocks
            if (session?.user) {
              setTimeout(async () => {
                try {
                  // Fetch user profile data
                  const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('user_type')
                    .eq('id', session.user.id)
                    .maybeSingle();

                  if (profileError) throw profileError;
                  
                  if (!profileData) {
                    console.error("No profile found for user:", session.user.id);
                  toast({
                    title: "Account Setup Incomplete",
                    description: "Your user profile is missing. Please contact support.",
                    variant: "destructive",
                  });
                  await supabase.auth.signOut();
                  return;
                }
                
                // Update the auth store
                setAuth(session.user.id, profileData.user_type as 'staff' | 'customer' | 'admin');
                } catch (err) {
                  console.error("Error in auth change handler:", err);
                  toast({
                    title: "Authentication Error",
                    description: "There was a problem with your session. Please sign in again.",
                    variant: "destructive",
                  });
                  await supabase.auth.signOut();
                }
              }, 0);
            } else {
              // User signed out or session expired
              clearAuth();
            }
          }
        );
        
        // Check for existing session
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
        
        if (!data.session?.user) {
          clearAuth();
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, [setAuth, clearAuth, toast]);

  const handleSignIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }
      
      if (!data.user) {
        toast({
          title: "Sign In Failed",
          description: "No user data received",
          variant: "destructive",
        });
        return { success: false, error: new Error("No user data received") };
      }
      
      toast({
        title: "Welcome Back!",
        description: "You've been signed in successfully.",
      });
      
      return { success: true, data };
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign In Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleSignUp = useCallback(async (email: string, password: string, userData: Record<string, any>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }
      
      toast({
        title: "Account Created",
        description: "Please check your email to verify your account.",
      });
      
      return { success: true, data };
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign Up Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleSignOut = useCallback(async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      clearAuth();
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
      navigate("/auth", { replace: true });
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign Out Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [toast, navigate, clearAuth]);

  const handleResetPassword = useCallback(async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast({
          title: "Password Reset Failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
      
      return { success: true };
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Password Reset Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleUpdatePassword = useCallback(async (newPassword: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        toast({
          title: "Password Update Failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      
      return { success: true };
    } catch (error) {
      console.error("Password update error:", error);
      toast({
        title: "Password Update Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    user,
    isAuthenticated,
    userId,
    userType,
    loading,
    handleSignIn,
    handleSignUp,
    handleSignOut,
    handleResetPassword,
    handleUpdatePassword,
  };
}
