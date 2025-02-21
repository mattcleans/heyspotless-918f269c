
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Calendar, DollarSign, MessageSquare, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/App";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const staffMenuItems = [
  {
    icon: Home,
    label: "Dashboard",
    path: "/"
  },
  {
    icon: Users,
    label: "Clients",
    path: "/clients"
  },
  {
    icon: Calendar,
    label: "Schedule",
    path: "/schedule"
  },
  {
    icon: DollarSign,
    label: "Quotes",
    path: "/quotes"
  },
  {
    icon: MessageSquare,
    label: "Messages",
    path: "/messages"
  }
];

const customerMenuItems = [
  {
    icon: Home,
    label: "Dashboard",
    path: "/"
  },
  {
    icon: Calendar,
    label: "Book Service",
    path: "/schedule"
  },
  {
    icon: DollarSign,
    label: "Get Quote",
    path: "/quotes"
  },
  {
    icon: MessageSquare,
    label: "Messages",
    path: "/messages"
  }
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const userType = useAuthStore((state) => state.userType);
  const userId = useAuthStore((state) => state.userId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);

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
          // For authenticated users (implement this part after adding messages table)
          // You'll need to count unread messages for the authenticated user
          setUnreadCount(0); // Placeholder for now
        }
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    fetchUnreadMessages();

    // Set up real-time subscription for updates
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
          <div className="p-6">
            <div className="flex items-center justify-center">
              <img 
                src="/lovable-uploads/bbb5176c-dbed-4e4a-8029-a3982064c2ea.png" 
                alt="Hey Spotless Logo" 
                className="h-20 w-auto"
              />
            </div>
            <p className="text-sm text-[#1B365D] mt-1">
              {userType === 'staff' ? 'Staff Portal' : 'Customer Portal'}
            </p>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isMessages = item.path === '/messages';
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors relative",
                    "hover:bg-[#A8E6EF]/10 hover:text-[#0066B3]",
                    isActive ? "bg-[#A8E6EF]/10 text-[#0066B3]" : "text-[#1B365D]"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                  {isMessages && unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

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

