
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { create } from 'zustand';

interface AuthStore {
  userId: string | null;
  userType: 'staff' | 'customer' | 'admin' | null;
  setAuth: (userId: string, userType: 'staff' | 'customer' | 'admin') => void;
  clearAuth: () => void;
}

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
  const { toast } = useToast();
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading || !mounted.current) {
      return;
    }

    if (!email || !email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (mounted.current) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (mounted.current) {
        setShowVerifyAlert(true);
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
        setLoading(false);
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

