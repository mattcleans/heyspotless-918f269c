
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  CreditCard,
  Image,
  MapPin,
  MessageCircle,
  Star,
  ThumbsUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Quick Quote",
    description: "Get an instant quote for your cleaning needs",
    icon: DollarSign,
    path: "/quotes/new",
    color: "text-[#0066B3]",
    bgColor: "bg-[#A8E6EF]/10",
  },
  {
    title: "Schedule Service",
    description: "Book or manage your cleaning appointments",
    icon: Calendar,
    path: "/schedule",
    color: "text-[#0066B3]",
    bgColor: "bg-[#A8E6EF]/10",
  },
  {
    title: "Payment Methods",
    description: "Update your payment information",
    icon: CreditCard,
    path: "/payments",
    color: "text-[#1B365D]",
    bgColor: "bg-[#A8E6EF]/10",
  },
  {
    title: "Messages",
    description: "Chat with your cleaner or management",
    icon: MessageCircle,
    path: "/messages",
    color: "text-[#1B365D]",
    bgColor: "bg-[#A8E6EF]/10",
  },
];

const cleanerFeatures = [
  {
    title: "Location Tracking",
    description: "Track cleaners' real-time location",
    icon: MapPin,
    color: "text-[#0066B3]",
  },
  {
    title: "Photo Documentation",
    description: "View before & after cleaning photos",
    icon: Image,
    color: "text-[#1B365D]",
  },
  {
    title: "Client Reviews",
    description: "Manage and view client feedback",
    icon: Star,
    color: "text-[#FFD700]",
  },
  {
    title: "Referral Program",
    description: "Generate and track referrals",
    icon: ThumbsUp,
    color: "text-[#0066B3]",
  },
];

const activeClients = [
  {
    name: "Sarah Johnson",
    address: "123 Main St, Dallas, TX",
    nextService: "Tomorrow at 2:00 PM",
    status: "Confirmed",
  },
  {
    name: "Michael Smith",
    address: "456 Oak Ave, Dallas, TX",
    nextService: "Friday at 10:00 AM",
    status: "Pending",
  },
  {
    name: "Emma Davis",
    address: "789 Pine Rd, Dallas, TX",
    nextService: "Next Week",
    status: "Scheduled",
  },
];

const ClientsPage = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B365D]">Client Management</h1>
          <p className="text-[#1B365D]/60">
            Manage your clients and cleaning services
          </p>
        </div>
        <Button className="bg-[#0066B3] hover:bg-[#0066B3]/90">
          <Users className="mr-2 h-4 w-4" /> Add New Client
        </Button>
      </div>

      {/* Client Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Link key={index} to={feature.path}>
            <Card className="p-6 hover-scale glass-card cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className={`rounded-full p-3 ${feature.bgColor}`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="font-medium text-[#1B365D]">{feature.title}</h3>
                  <p className="text-sm text-[#1B365D]/60">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Active Clients List */}
      <Card className="p-6 glass-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-[#1B365D]">Active Clients</h2>
          <Button variant="outline" className="text-[#0066B3]">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {activeClients.map((client, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-[#A8E6EF]/5"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#A8E6EF]/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#0066B3]" />
                </div>
                <div>
                  <p className="font-medium text-[#1B365D]">{client.name}</p>
                  <p className="text-sm text-[#1B365D]/60">{client.address}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#0066B3]">
                  {client.nextService}
                </p>
                <p className="text-sm text-[#1B365D]/60">{client.status}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Cleaner Management Features */}
      <div>
        <h2 className="text-lg font-semibold text-[#1B365D] mb-4">
          Cleaner Management
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cleanerFeatures.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover-scale glass-card cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-full p-3 bg-[#A8E6EF]/10">
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="font-medium text-[#1B365D]">{feature.title}</h3>
                  <p className="text-sm text-[#1B365D]/60">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
