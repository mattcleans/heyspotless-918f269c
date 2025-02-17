
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const WelcomeHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-[#1B365D]">Welcome Back!</h1>
      <Button variant="outline" onClick={() => navigate("/profile/edit")}>
        <Edit className="w-4 h-4 mr-2" /> Edit Profile
      </Button>
    </div>
  );
};
