
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WelcomeHeader = () => {
  const { toast } = useToast();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-[#1B365D]">Welcome Back!</h1>
      <Button variant="outline" onClick={() => toast({ description: "Profile edit coming soon!" })}>
        <Edit className="w-4 h-4 mr-2" /> Edit Profile
      </Button>
    </div>
  );
};
