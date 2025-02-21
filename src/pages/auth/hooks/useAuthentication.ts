
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/App";

export const useAuthentication = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<'customer' | 'staff' | 'admin'>('customer');
  const [loading, setLoading] = useState(false);
  const [showVerifyAlert, setShowVerifyAlert] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const recoverSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session recovery error:", error);
          return;
        }
        
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileData) {
            setAuth(session.user.id, profileData.user_type as 'staff' | 'customer' | 'admin');
            navigate("/", { replace: true });
          }
        }
      } catch (error) {
        console.error("Session recovery failed:", error);
      }
    };

    recoverSession();
  }, [setAuth, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    try {
      setLoading(true);
      setShowVerifyAlert(false);
      console.log("Starting login process...");
      
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }

      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        throw signInError;
      }

      if (!authData?.user) {
        throw new Error("No user data received");
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!profileData) {
        throw new Error("Profile not found");
      }

      setAuth(authData.user.id, profileData.user_type as 'staff' | 'customer' | 'admin');
      
      // Show success toast and reset form
      toast({
        title: "Success",
        description: "Successfully logged in!",
      });
      
      setEmail("");
      setPassword("");
      
      // Navigate after everything else is done
      navigate("/", { replace: true });
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "An unexpected error occurred";
      
      if (error.message.includes("Email not confirmed")) {
        setShowVerifyAlert(true);
        errorMessage = "Please verify your email address before signing in. Check your inbox for a confirmation link.";
      } else if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message === "Profile not found") {
        errorMessage = "User profile not found. Please contact support.";
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    try {
      setLoading(true);
      setShowVerifyAlert(false);
      console.log("Starting signup process...");
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setShowVerifyAlert(true);
        toast({
          title: "Success",
          description: "Registration successful! Please check your email to verify your account before logging in.",
        });
        setEmail("");
        setPassword("");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.status === 429) {
        errorMessage = "Please wait a minute before trying to sign up again.";
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    userType,
    setUserType,
    loading,
    showVerifyAlert,
    rememberMe,
    setRememberMe,
    handleLogin,
    handleSignUp
  };
};
