
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerifyAlert, setShowVerifyAlert] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const safeSetLoading = (value: boolean) => {
    if (mounted.current) {
      setLoading(value);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) {
      console.log("Login already in progress");
      return;
    }
    
    console.log("Starting login process");
    safeSetLoading(true);
    
    try {
      if (!email || !password) {
        console.log("Missing credentials");
        toast({
          title: "Error",
          description: "Please enter both email and password",
          variant: "destructive",
        });
        safeSetLoading(false);
        return;
      }

      console.log("Authenticating with Supabase");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Auth error:", error);
        if (error.message.includes("Email not confirmed")) {
          setShowVerifyAlert(true);
          toast({
            title: "Verification Required",
            description: "Please check your email and verify your account before signing in.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        }
        safeSetLoading(false);
        return;
      }

      if (!data?.user) {
        console.error("No user data received");
        toast({
          title: "Error",
          description: "Login failed - no user data received",
          variant: "destructive",
        });
        safeSetLoading(false);
        return;
      }

      console.log("Fetching user profile with RLS-compliant query");
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile error:", profileError);
        toast({
          title: "Error",
          description: "Failed to load user profile: " + profileError.message,
          variant: "destructive",
        });
        
        await supabase.auth.signOut();
        safeSetLoading(false);
        return;
      }

      if (!profile) {
        console.error("No profile found for user:", data.user.id);
        toast({
          title: "Account Setup Incomplete",
          description: "Your user profile is missing. Please contact support.",
          variant: "destructive",
        });
        
        await supabase.auth.signOut();
        safeSetLoading(false);
        return;
      }

      console.log("Setting auth state with profile:", profile);
      setAuth(data.user.id, profile.user_type as 'staff' | 'customer' | 'admin');

      if (mounted.current) {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
        });
        
        console.log("Navigating to dashboard");
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      if (mounted.current) {
        toast({
          title: "Error",
          description: "An unexpected error occurred during login",
          variant: "destructive",
        });
      }
    } finally {
      if (mounted.current) {
        safeSetLoading(false);
      }
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    showVerifyAlert,
    rememberMe,
    setRememberMe,
    handleLogin
  };
};
