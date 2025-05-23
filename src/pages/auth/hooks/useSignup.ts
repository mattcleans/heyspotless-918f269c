
import { useState } from "react";
import { signUp, cleanupAuthState } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSignup = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerifyAlert, setShowVerifyAlert] = useState(false);

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

      // Clean up existing auth state to prevent issues
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
    handleCustomerSignUp
  };
};
