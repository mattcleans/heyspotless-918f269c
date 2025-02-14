
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  Calendar, 
  DollarSign, 
  MessageSquare,
  Menu,
  X,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Users, label: "Clients", path: "/clients" },
  { icon: Calendar, label: "Schedule", path: "/schedule" },
  { icon: DollarSign, label: "Quotes", path: "/quotes" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white shadow-lg md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-[#FFD700]" />
              <h1 className="text-2xl font-semibold text-[#0066B3]">Hey Spotless</h1>
            </div>
            <p className="text-sm text-[#1B365D] mt-1">Dallas Cleaning Professionals</p>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    "hover:bg-[#A8E6EF]/10 hover:text-[#0066B3]",
                    isActive
                      ? "bg-[#A8E6EF]/10 text-[#0066B3]"
                      : "text-[#1B365D]"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-6">
            <div className="p-4 rounded-lg bg-[#A8E6EF]/10">
              <p className="text-sm text-[#0066B3]">
                Need help? Contact support
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
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
