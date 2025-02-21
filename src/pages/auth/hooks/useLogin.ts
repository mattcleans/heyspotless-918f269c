
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { create } from 'zustand';

// Define the auth store types
interface AuthStore {
  userId: string | null;
  userType: 'staff' | 'customer' | 'admin' | null;
  setAuth: (userId: string, userType: 'staff' | 'customer' | 'admin') => void;
  clearAuth: () => void;
}

// Create the auth store
export const useAuthStore = create<AuthStore>((set) => ({
  userId: null,
  userType: null,
  setAuth: (userId, userType) => set({ userId, userType }),
  clearAuth: () => set({ userId: null, userType: null }),
}));

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerifyAlert, setShowVerifyAlert] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email.toLowerCase());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) {
      console.log("Login already in progress");
      return;
    }
    
    console.log("Starting login process");
    console.log("Email value:", email);

    if (!email || !validateEmail(email)) {
      console.log("Invalid email:", email);
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    safeSetLoading(true);
    
    try {
      console.log("Sending magic link to:", email);
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Auth error:", error);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        safeSetLoading(false);
        return;
      }

      setShowVerifyAlert(true);
      
      if (mounted.current) {
        toast({
          title: "Check your email",
          description: "We've sent you a magic link to sign in",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      if (mounted.current) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
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
    loading,
    showVerifyAlert,
    rememberMe,
    setRememberMe,
    handleLogin
  };
};
