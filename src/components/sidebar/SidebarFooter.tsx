
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/App";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const SidebarFooter = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setAuth(null, null);
      toast.success("Successfully logged out");
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error("Error logging out. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="p-4 rounded-lg bg-[#A8E6EF]/10">
        <p className="text-sm text-[#0066B3]">
          Need help? Contact support
        </p>
      </div>
      
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Log Out
        </button>
      )}
    </div>
  );
};
