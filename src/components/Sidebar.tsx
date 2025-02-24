
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/App";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNav } from "./sidebar/SidebarNav";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { staffMenuItems, customerMenuItems } from "./sidebar/menuItems";
import { useUnreadMessages } from "@/hooks/use-unread-messages";
import { ErrorBoundary } from "react-error-boundary";

interface SidebarErrorFallbackProps {
  error: Error;
}

const SidebarErrorFallback = ({ error }: SidebarErrorFallbackProps) => (
  <div className="p-4 text-red-600">
    <h3 className="font-semibold">Something went wrong:</h3>
    <p className="text-sm">{error.message}</p>
  </div>
);

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = useUnreadMessages();
  const userType = useAuthStore((state) => state.userType);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const menuItems = userType === 'staff' ? staffMenuItems : customerMenuItems;

  return (
    <>
      <button 
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white shadow-lg md:hidden" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ErrorBoundary FallbackComponent={SidebarErrorFallback}>
          <div className="flex flex-col h-full">
            <SidebarHeader />
            <SidebarNav menuItems={menuItems} unreadCount={unreadCount} />
            <SidebarFooter isAuthenticated={isAuthenticated} />
          </div>
        </ErrorBoundary>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
