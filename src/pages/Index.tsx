import { useAuthStore } from "@/App";
import { Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Clock,
  TrendingUp,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Active Clients",
    value: "32",
    icon: Users,
    trend: "+2 this month",
    color: "text-[#0066B3]"
  },
  {
    title: "Scheduled Jobs",
    value: "12",
    icon: Calendar,
    trend: "Next 7 days",
    color: "text-[#1B365D]"
  },
  {
    title: "Revenue",
    value: "$8,420",
    icon: DollarSign,
    trend: "+12% from last month",
    color: "text-[#0066B3]"
  },
  {
    title: "Avg. Job Duration",
    value: "2.5h",
    icon: Clock,
    trend: "On target",
    color: "text-[#1B365D]"
  },
];

const IndexPage = () => {
  const { isAuthenticated, userType } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Show different content based on user type
  if (userType === 'customer') {
    return <Navigate to="/schedule" replace />;  // Redirect customers to booking page
  }

  // Staff dashboard remains the same
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-8">
        <img 
          src="/lovable-uploads/bbb5176c-dbed-4e4a-8029-a3982064c2ea.png" 
          alt="Hey Spotless Logo" 
          className="h-20 object-contain mb-4"
        />
        <h1 className="text-3xl font-bold text-[#1B365D]">
          Hey Spotless
        </h1>
        <p className="text-[#1B365D]/60 mt-2">
          GOODBYE SPOTS • HELLO SPARKLE
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#1B365D]/60">{stat.title}</p>
                  <p className="text-2xl font-semibold text-[#1B365D]">{stat.value}</p>
                </div>
                <div className={`rounded-full p-3 ${stat.color} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-[#1B365D]/60">
                <TrendingUp className="w-4 h-4 mr-1" />
                {stat.trend}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#1B365D]">Upcoming Appointments</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-[#A8E6EF]/5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1B365D] truncate">
                    123 Main St Cleaning
                  </p>
                  <p className="text-sm text-[#1B365D]/60">
                    Tomorrow at 2:00 PM
                  </p>
                </div>
                <div className="inline-flex items-center text-sm font-semibold text-[#0066B3]">
                  View details →
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#1B365D]">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-[#A8E6EF]/5">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#A8E6EF]/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#0066B3]" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1B365D]">
                    New client added
                  </p>
                  <p className="text-sm text-[#1B365D]/60">
                    2 hours ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default IndexPage;
