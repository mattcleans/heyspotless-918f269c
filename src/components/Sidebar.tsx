
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/App";
import { supabase } from "@/integrations/supabase/client";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNav } from "./sidebar/SidebarNav";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { staffMenuItems, customerMenuItems } from "./sidebar/menuItems";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userType = useAuthStore((state) => state.userType);
  const userId = useAuthStore((state) => state.userId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const menuItems = userType === 'staff' ? staffMenuItems : customerMenuItems;

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        if (!isAuthenticated) {
          const { count } = await supabase
            .from('support_messages')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'unread')
            .eq('sender_type', 'guest');

          setUnreadCount(count || 0);
        } else if (userId) {
          setUnreadCount(0);
        }
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    fetchUnreadMessages();

    const subscription = supabase
      .channel('unread-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_messages'
        },
        () => {
          fetchUnreadMessages();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated, userId]);

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
        <div className="flex flex-col h-full">
          <SidebarHeader />
          <SidebarNav menuItems={menuItems} unreadCount={unreadCount} />
          <SidebarFooter isAuthenticated={isAuthenticated} />
        </div>
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
