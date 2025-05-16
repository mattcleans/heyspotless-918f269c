import { useState } from "react";
import { supabase, signUp, cleanupAuthState } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCleanerSignup = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [ssn, setSsn] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactEmail, setEmergencyContactEmail] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [contractorAcknowledgment, setContractorAcknowledgment] = useState(false);
  const [workEligibilityAcknowledgment, setWorkEligibilityAcknowledgment] = useState(false);
  const [backgroundCheckAcknowledgment, setBackgroundCheckAcknowledgment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerifyAlert, setShowVerifyAlert] = useState(false);

  const handleCleanerSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    console.log("Starting cleaner registration process");
    
    try {
      if (!email || !password || !firstName || !lastName || !phone || !ssn || 
          !street || !city || !state || !zipCode || 
          !emergencyContactName || !emergencyContactPhone || 
          !contractorAcknowledgment || !workEligibilityAcknowledgment || !backgroundCheckAcknowledgment) {
        toast({
          title: "Error",
          description: "Please fill in all required fields and accept all acknowledgments",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Clean up existing auth state to prevent issues
      cleanupAuthState();
      
      console.log("Signing up with Supabase");
      const { data: signUpData, error: signUpError } = await signUp(email, password, {
        user_type: 'staff',
        first_name: firstName,
        last_name: lastName,
        phone: phone
      });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        toast({
          title: "Registration Failed",
          description: signUpError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!signUpData?.user) {
        console.error("No user data received during signup");
        toast({
          title: "Registration Failed",
          description: "No user data received",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("User registered, creating cleaner profile");
      // Create cleaner profile
      const { error: profileError } = await supabase
        .from('cleaner_profiles')
        .insert({
          id: signUpData.user.id,
          ssn,
          years_experience: parseInt(yearsExperience) || 0,
          emergency_contact_name: emergencyContactName,
          emergency_contact_email: emergencyContactEmail || null,
          emergency_contact_phone: emergencyContactPhone,
          contractor_acknowledgment: contractorAcknowledgment,
          work_eligibility_acknowledgment: workEligibilityAcknowledgment,
          background_check_acknowledgment: backgroundCheckAcknowledgment,
          hourly_rate: 0
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        toast({
          title: "Error",
          description: "Failed to create cleaner profile: " + profileError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("Creating address");
      // Create address
      const { error: addressError } = await supabase
        .from('addresses')
        .insert({
          user_id: signUpData.user.id,
          street,
          city,
          state,
          postal_code: zipCode,
          is_primary: true
        });

      if (addressError) {
        console.error("Address creation error:", addressError);
        toast({
          title: "Error",
          description: "Failed to save address: " + addressError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      setShowVerifyAlert(true);
      // Clear form
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setPhone("");
      setSsn("");
      setYearsExperience("");
      setStreet("");
      setCity("");
      setState("");
      setZipCode("");
      setEmergencyContactName("");
      setEmergencyContactEmail("");
      setEmergencyContactPhone("");
      setContractorAcknowledgment(false);
      setWorkEligibilityAcknowledgment(false);
      setBackgroundCheckAcknowledgment(false);
      
      toast({
        title: "Success",
        description: "Please check your email to verify your account before logging in.",
      });
      console.log("Cleaner registration successful");
    } catch (error) {
      console.error("Unexpected error during cleaner registration:", error);
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
    ssn,
    setSsn,
    yearsExperience,
    setYearsExperience,
    street,
    setStreet,
    city,
    setCity,
    state,
    setState,
    zipCode,
    setZipCode,
    emergencyContactName,
    setEmergencyContactName,
    emergencyContactEmail,
    setEmergencyContactEmail,
    emergencyContactPhone,
    setEmergencyContactPhone,
    contractorAcknowledgment,
    setContractorAcknowledgment,
    workEligibilityAcknowledgment,
    setWorkEligibilityAcknowledgment,
    backgroundCheckAcknowledgment,
    setBackgroundCheckAcknowledgment,
    loading,
    showVerifyAlert,
    handleCleanerSignUp
  };
};
