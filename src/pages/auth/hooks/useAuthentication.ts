
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/App";

export const useAuthentication = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerifyAlert, setShowVerifyAlert] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) {
      console.log("Login already in progress, preventing duplicate submission");
      return;
    }
    
    console.log("Starting login process...");
    setLoading(true);
    
    try {
      // Basic validation
      if (!email || !password) {
        console.log("Missing email or password");
        toast({
          title: "Error",
          description: "Please enter both email and password",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("Attempting to sign in with Supabase...");
      const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error:", error);
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
        setLoading(false);
        return;
      }

      if (!user) {
        console.error("No user data received");
        toast({
          title: "Error",
          description: "No user data received",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("Successfully signed in, fetching user profile...");
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!profile) {
        console.error("No profile found for user:", user.id);
        toast({
          title: "Error",
          description: "No user profile found",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("Setting auth state with:", {
        userId: user.id,
        userType: profile.user_type
      });

      // Update auth state
      setAuth(user.id, profile.user_type as 'staff' | 'customer' | 'admin');

      // Show success message
      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });

      console.log("Navigating to homepage...");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    
    try {
      if (!email || !password || !firstName || !lastName || !phone) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: 'customer',
            first_name: firstName,
            last_name: lastName,
            phone: phone
          }
        }
      });

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        setShowVerifyAlert(true);
        // Reset form
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setPhone("");
        
        toast({
          title: "Success",
          description: "Please check your email to verify your account before logging in.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during registration",
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
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    loading,
    showVerifyAlert,
    rememberMe,
    setRememberMe,
    handleLogin,
    handleCustomerSignUp
  };
};
