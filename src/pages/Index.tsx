
import { Card } from "@/components/ui/card";
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Clock,
  TrendingUp
} from "lucide-react";

const stats = [
  {
    title: "Active Clients",
    value: "32",
    icon: Users,
    trend: "+2 this month",
    color: "text-sage-500"
  },
  {
    title: "Scheduled Jobs",
    value: "12",
    icon: Calendar,
    trend: "Next 7 days",
    color: "text-stone-500"
  },
  {
    title: "Revenue",
    value: "$8,420",
    icon: DollarSign,
    trend: "+12% from last month",
    color: "text-sage-500"
  },
  {
    title: "Avg. Job Duration",
    value: "2.5h",
    icon: Clock,
    trend: "On target",
    color: "text-stone-500"
  },
];

const Index = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col space-y-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-gray-500">Here's what's happening with your business today.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover-scale glass-card">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
                <div className={`rounded-full p-3 ${stat.color} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <TrendingUp className="w-4 h-4 mr-1" />
                {stat.trend}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 glass-card">
          <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    123 Main St Cleaning
                  </p>
                  <p className="text-sm text-gray-500">
                    Tomorrow at 2:00 PM
                  </p>
                </div>
                <div className="inline-flex items-center text-sm font-semibold text-sage-600">
                  View details →
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 glass-card">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                    <Users className="w-4 h-4 text-stone-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    New client added
                  </p>
                  <p className="text-sm text-gray-500">
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

export default Index;
