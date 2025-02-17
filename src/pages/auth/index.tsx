import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/App";
import { AuthCard } from "./components/AuthCard";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<'customer' | 'staff' | 'admin'>('customer');
  const [loading, setLoading] = useState(false);
  const [showVerifyAlert, setShowVerifyAlert] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setShowVerifyAlert(false);
    
    try {
      console.log("Starting login process...");
      console.log("Remember me:", rememberMe);
      
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }

      let authResponse;
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        authResponse = { data: authData, error: authError };
        console.log("Auth response received:", authResponse);
      } catch (signInError: any) {
        console.error("Sign in error:", signInError);
        if (signInError.message?.includes("Failed to fetch")) {
          throw new Error("Could not connect to authentication service. Please check your internet connection and try again.");
        }
        throw signInError;
      }

      const { data, error } = authResponse;

      if (error) {
        console.error("Login error:", error);
        if (error.message.includes("Email not confirmed")) {
          setShowVerifyAlert(true);
          throw new Error("Please verify your email address before signing in. Check your inbox for a confirmation link.");
        }
        if (error.message.includes("Invalid login credentials")) {
          throw new Error(
            "Login failed. Please check:\n" +
            "1. Your email address is correct\n" +
            "2. Your password is correct\n" +
            "3. You've registered an account (use the Register tab if you haven't)"
          );
        }
        throw error;
      }

      if (!data.user) {
        throw new Error("No user data received. Please try again.");
      }

      console.log("User authenticated, fetching profile...");
      
      let profileResponse;
      try {
        profileResponse = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .maybeSingle();
        console.log("Profile fetch response:", profileResponse);
      } catch (profileError: any) {
        console.error("Profile fetch error:", profileError);
        throw new Error("Could not fetch user profile. Please try again.");
      }

      const { data: profileData, error: profileError } = profileResponse;

      if (profileError) {
        console.error("Profile error:", profileError);
        throw new Error("Could not fetch user profile. Please try again.");
      }

      if (!profileData) {
        console.error("No profile found");
        throw new Error("User profile not found. Please contact support.");
      }

      console.log("Setting auth state with:", {
        userId: data.user.id,
        userType: profileData.user_type
      });
      
      setAuth(data.user.id, profileData.user_type as 'staff' | 'customer' | 'admin');
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

  return (
    <AuthCard showVerifyAlert={showVerifyAlert}>
      <Tabs defaultValue="login" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LoginForm
            email={email}
            password={password}
            loading={loading}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onSubmit={handleLogin}
            rememberMe={rememberMe}
            onRememberMeChange={setRememberMe}
          />
        </TabsContent>

        <TabsContent value="register">
          <RegisterForm
            email={email}
            password={password}
            userType={userType}
            loading={loading}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onUserTypeChange={setUserType}
            onSubmit={handleSignUp}
          />
        </TabsContent>
      </Tabs>
    </AuthCard>
  );
};

export default AuthPage;
