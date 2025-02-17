
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
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/lovable-uploads/bbb5176c-dbed-4e4a-8029-a3982064c2ea.png" 
                alt="Hey Spotless Logo" 
                className="h-16 object-contain"
              />
            </div>
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
