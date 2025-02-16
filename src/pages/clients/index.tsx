
import { useState } from "react";
import ClientDashboard from "./components/ClientDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LogIn, Star } from "lucide-react";

const ClientsPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-8 h-8 text-[#FFD700]" />
            </div>
            <h1 className="text-2xl font-bold text-[#0066B3]">Welcome Back</h1>
            <p className="text-[#1B365D]/60">Sign in to manage your services</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Input type="email" placeholder="Email address" />
            </div>
            <div className="space-y-2">
              <Input type="password" placeholder="Password" />
            </div>
            <Button 
              className="w-full bg-[#0066B3]"
              onClick={() => setIsLoggedIn(true)}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </div>

          <div className="text-center text-sm text-[#1B365D]/60">
            <p>Don't have an account? <Button variant="link" className="text-[#0066B3] p-0">Sign up</Button></p>
            <Button variant="link" className="text-[#0066B3] p-0">Forgot password?</Button>
          </div>
        </Card>
      </div>
    );
  }

  return <ClientDashboard />;
};

export default ClientsPage;
