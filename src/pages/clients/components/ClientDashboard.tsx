
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  CreditCard,
  MessageSquare,
  Star,
} from "lucide-react";

const ClientDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0066B3]">Welcome back, Sarah</h1>
          <p className="text-[#1B365D]/60">Manage your cleaning services</p>
        </div>
        <Button className="bg-[#0066B3]">
          <Calendar className="mr-2 h-4 w-4" />
          Book New Service
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#0066B3]/10 rounded-full">
              <Calendar className="h-6 w-6 text-[#0066B3]" />
            </div>
            <div>
              <p className="text-sm text-[#1B365D]/60">Next Cleaning</p>
              <p className="text-lg font-semibold text-[#1B365D]">March 15, 2024</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#0066B3]/10 rounded-full">
              <Clock className="h-6 w-6 text-[#0066B3]" />
            </div>
            <div>
              <p className="text-sm text-[#1B365D]/60">Service Time</p>
              <p className="text-lg font-semibold text-[#1B365D]">10:00 AM</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#0066B3]/10 rounded-full">
              <Star className="h-6 w-6 text-[#0066B3]" />
            </div>
            <div>
              <p className="text-sm text-[#1B365D]/60">Service Plan</p>
              <p className="text-lg font-semibold text-[#1B365D]">Weekly Clean</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-transparent h-auto p-0">
          <TabsTrigger
            value="bookings"
            className="data-[state=active]:bg-[#0066B3] data-[state=active]:text-white"
          >
            <Calendar className="mr-2 h-4 w-4" />
            My Bookings
          </TabsTrigger>
          <TabsTrigger
            value="wallet"
            className="data-[state=active]:bg-[#0066B3] data-[state=active]:text-white"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Wallet
          </TabsTrigger>
          <TabsTrigger
            value="messages"
            className="data-[state=active]:bg-[#0066B3] data-[state=active]:text-white"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[#1B365D] mb-4">Upcoming Services</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-[#1B365D]">Standard Clean</p>
                    <p className="text-sm text-[#1B365D]/60">March {12 + i}, 2024 • 10:00 AM</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[#1B365D] mb-4">Payment Methods</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-6 w-6 text-[#1B365D]" />
                  <div>
                    <p className="font-medium text-[#1B365D]">•••• 4242</p>
                    <p className="text-sm text-[#1B365D]/60">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Remove
                </Button>
              </div>
              <Button className="w-full">
                Add New Payment Method
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[#1B365D] mb-4">Recent Messages</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 border rounded-lg"
                >
                  <div className="p-2 bg-[#0066B3]/10 rounded-full">
                    <MessageSquare className="h-4 w-4 text-[#0066B3]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1B365D]">Cleaning Update</p>
                    <p className="text-sm text-[#1B365D]/60 mt-1">
                      Your cleaner has arrived and started the service...
                    </p>
                    <p className="text-xs text-[#1B365D]/40 mt-2">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDashboard;
