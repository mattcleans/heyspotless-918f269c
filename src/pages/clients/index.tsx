
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/App";
import ClientDashboard from "./components/ClientDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ClientsPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile to get user type
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .single();

        setAuth(data.user.id, profileData?.user_type as 'customer' | 'staff');
        navigate('/');
        toast.success('Successfully logged in!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Check your email to confirm your account!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <ClientDashboard />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/bbb5176c-dbed-4e4a-8029-a3982064c2ea.png" 
              alt="Hey Spotless Logo" 
              className="h-16 object-contain"
            />
          </div>
          <p className="text-[#1B365D]/60">Sign in to manage your services</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit"
            className="w-full bg-[#0066B3]"
            disabled={loading}
          >
            <LogIn className="mr-2 h-4 w-4" />
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center text-sm text-[#1B365D]/60">
          <p>
            Don't have an account? 
            <Button 
              variant="link" 
              className="text-[#0066B3] p-0 ml-1"
              onClick={handleSignUp}
              disabled={loading}
            >
              Sign up
            </Button>
          </p>
          <Button 
            variant="link" 
            className="text-[#0066B3] p-0"
            onClick={() => toast.info('Password reset functionality coming soon!')}
          >
            Forgot password?
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ClientsPage;
