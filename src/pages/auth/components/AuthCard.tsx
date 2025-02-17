
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthCardProps {
  showVerifyAlert: boolean;
  children: React.ReactNode;
}

export const AuthCard = ({ showVerifyAlert, children }: AuthCardProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-6">
          <img 
            src="/lovable-uploads/bbb5176c-dbed-4e4a-8029-a3982064c2ea.png" 
            alt="Hey Spotless Logo" 
            className="h-16 object-contain"
          />
        </div>

        {showVerifyAlert && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please check your email and click the verification link to complete your registration.
            </AlertDescription>
          </Alert>
        )}

        {children}
      </Card>
    </div>
  );
};
