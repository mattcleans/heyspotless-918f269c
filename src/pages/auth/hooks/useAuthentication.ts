
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signIn, resetPassword, updatePassword, cleanupAuthState } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth";

export const useAuthentication = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Signup state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  
  // UI state
  const [showVerifyAlert, setShowVerifyAlert] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    
    try {
      if (!email || !password) {
        toast({
          title: "Error",
          description: "Please enter both email and password",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      cleanupAuthState();
      
      const { data, error } = await signIn(email, password);

      if (error) {
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

      if (data?.user) {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
        });
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during login",
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
        setLoading(false);
        return;
      }

      cleanupAuthState();
      
      const { data, error } = await signUp(email, password, {
        user_type: 'customer',
        first_name: firstName,
        last_name: lastName,
        phone: phone
      });

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (data?.user) {
        setShowVerifyAlert(true);
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const resetEmail = formData.get('email') as string;
      
      if (!resetEmail) {
        toast({
          title: "Error",
          description: "Please enter your email address",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      const { error } = await resetPassword(resetEmail);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for password reset instructions",
      });
      
      setIsResetMode(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (newPassword: string) => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      const { error } = await updatePassword(newPassword);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Success",
        description: "Your password has been updated successfully",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating your password",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
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
    isResetMode,
    setIsResetMode,
    // Actions
    handleLogin,
    handleCustomerSignUp,
    handleForgotPassword,
    handleResetPassword,
  };
};
