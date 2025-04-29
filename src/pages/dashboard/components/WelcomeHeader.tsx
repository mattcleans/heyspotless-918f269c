
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const WelcomeHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useAuthStore();

  const { data: profile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-[#1B365D]">
        {isAuthenticated 
          ? `Welcome Back${profile?.first_name ? `, ${profile.first_name}` : ''}!`
          : "Welcome to Hey Spotless!"}
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
