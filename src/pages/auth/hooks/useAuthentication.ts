
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
    setLoading(true);
    setShowVerifyAlert(false);
    
    try {
      console.log("Starting login process...");
      
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }

      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          data: {
            persistSession: rememberMe
          }
        }
      });

      if (signInError) {
        console.error("Login error:", signInError);
        if (signInError.message.includes("Email not confirmed")) {
          setShowVerifyAlert(true);
          throw new Error("Please verify your email address before signing in. Check your inbox for a confirmation link.");
        }
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error(
            "Login failed. Please check:\n" +
            "1. Your email address is correct\n" +
            "2. Your password is correct\n" +
            "3. You've registered an account (use the Register tab if you haven't)"
          );
        }
        throw signInError;
      }

      if (!authData.user) {
        throw new Error("No user data received. Please try again.");
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError || !profileData) {
        console.error("Profile fetch error:", profileError);
        throw new Error("Could not fetch user profile. Please try again.");
      }

      console.log("Login successful, setting auth state with:", {
        userId: authData.user.id,
        userType: profileData.user_type
      });

      setAuth(authData.user.id, profileData.user_type as 'staff' | 'customer' | 'admin');
      navigate("/", { replace: true });
      toast({
        title: "Success",
        description: "Successfully logged in!",
      });
    } catch (error: any) {
      console.error("Final error caught:", error);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setShowVerifyAlert(false);
    
    try {
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

      console.log("Signup response:", { data, error });

      if (error) {
        console.error("Signup error:", error);
        if (error.status === 429) {
          throw new Error("Please wait a minute before trying to sign up again.");
        }
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
      console.error("Final signup error:", error);
      toast({
        title: "Registration Failed",
        description: error.message,
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
