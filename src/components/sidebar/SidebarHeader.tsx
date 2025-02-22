
import { useAuthStore } from "@/App";

export const SidebarHeader = () => {
  const userType = useAuthStore((state) => state.userType);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const getPortalTitle = () => {
    if (!isAuthenticated) return '';
    
    switch (userType) {
      case 'staff':
        return 'Employee Portal';
      case 'admin':
        return 'Administrator Portal';
      case 'customer':
        return 'Customer Portal';
      default:
        return '';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-center">
        <img 
          src="/lovable-uploads/1a676461-9ff9-4ab4-b021-67ce76b13650.png" 
          alt="Hey Spotless Logo" 
          className="h-20 w-auto"
        />
      </div>
      {isAuthenticated && (
        <p className="text-sm text-[#1B365D] mt-1">
          {getPortalTitle()}
        </p>
      )}
    </div>
  );
};
