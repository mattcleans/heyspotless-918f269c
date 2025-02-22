
import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface SidebarNavProps {
  menuItems: MenuItem[];
  unreadCount: number;
}

export const SidebarNav = ({ menuItems, unreadCount }: SidebarNavProps) => {
  const location = useLocation();

  return (
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
  );
};
