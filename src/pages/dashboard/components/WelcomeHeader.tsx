
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/App";

export const WelcomeHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-[#1B365D]">
        {isAuthenticated ? "Welcome Back!" : "Welcome to Hey Spotless!"}
      </h1>
      {isAuthenticated ? (
        <Button variant="outline" onClick={() => navigate("/profile/edit")}>
          <LogIn className="w-4 h-4 mr-2" /> Edit Profile
        </Button>
      ) : (
        <Button variant="outline" onClick={() => navigate("/auth")}>
          <LogIn className="w-4 h-4 mr-2" /> Log In
        </Button>
      )}
    </div>
  );
};
