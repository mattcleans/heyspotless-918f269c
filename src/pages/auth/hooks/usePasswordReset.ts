
import { useState } from "react";
import { resetPassword, updatePassword } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePasswordReset = () => {
  const [isResetMode, setIsResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    
    try {
      const email = (e.target as HTMLFormElement).email.value;
      
      if (!email) {
        toast({
          title: "Error",
          description: "Please enter your email address",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      const { error } = await resetPassword(email);
      
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
    isResetMode,
    setIsResetMode,
    handleForgotPassword,
    handleResetPassword,
    loading
  };
};
