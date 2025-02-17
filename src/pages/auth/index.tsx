
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setShowVerifyAlert(false);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
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

      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          throw new Error("Could not fetch user profile. Please try again.");
        }

        if (profileData?.user_type) {
          setAuth(data.user.id, profileData.user_type as 'staff' | 'customer' | 'admin');
          navigate("/", { replace: true });
          toast({
            title: "Success",
            description: "Successfully logged in!",
          });
        } else {
          throw new Error("User profile not found. Please contact support.");
        }
      }
    } catch (error: any) {
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
