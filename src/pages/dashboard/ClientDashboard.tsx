
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  CreditCard,
  MapPin,
  Star,
  User,
  Clock,
  Edit,
  Plus
} from "lucide-react";
import { format } from "date-fns";

const ClientDashboard = () => {
  const { userId } = useAuthStore();
  const { toast } = useToast();

  const { data: upcomingBookings } = useQuery({
    queryKey: ['upcomingBookings', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          cleaner:cleaner_id (
            hourly_rate,
            bio,
            profiles:id (user_type)
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'confirmed')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  const { data: addresses } = useQuery({
    queryKey: ['addresses', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const { data: paymentMethods } = useQuery({
    queryKey: ['paymentMethods', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const { data: currentCleaner } = useQuery({
    queryKey: ['currentCleaner', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_cleaner_matches')
        .select(`
          *,
          cleaner:cleaner_id (
            hourly_rate,
            bio,
            years_experience,
            profiles:id (user_type)
          )
        `)
        .eq('client_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1B365D]">Welcome Back!</h1>
        <Button variant="outline" onClick={() => toast({ description: "Profile edit coming soon!" })}>
          <Edit className="w-4 h-4 mr-2" /> Edit Profile
        </Button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Clean</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingBookings?.[0] ? (
                format(new Date(upcomingBookings[0].date), 'MMM d, yyyy')
              ) : (
                "No upcoming cleans"
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Cleaner</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentCleaner?.cleaner ? (
                `${currentCleaner.cleaner.hourly_rate}/hr`
              ) : (
                "Not assigned"
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Service</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingBookings?.[0]?.time || "No time set"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Cleans</CardTitle>
            <CardDescription>Your next scheduled cleaning services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBookings?.map((booking) => (
                <div 
                  key={booking.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{booking.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.date), 'MMMM d, yyyy')} at {booking.time}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => toast({ description: "Booking management coming soon!" })}>
                    Manage
                  </Button>
                </div>
              ))}
              {(!upcomingBookings || upcomingBookings.length === 0) && (
                <p className="text-muted-foreground text-center py-4">
                  No upcoming bookings
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Saved Addresses</CardTitle>
              <CardDescription>Your saved cleaning locations</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => toast({ description: "Address management coming soon!" })}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {addresses?.map((address) => (
                <div key={address.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{address.street}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                  </div>
                  {address.is_primary && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Your saved payment options</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => toast({ description: "Payment method management coming soon!" })}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods?.map((method) => (
                <div key={method.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{method.card_type} •••• {method.last_four}</p>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expiry_month}/{method.expiry_year}
                    </p>
                  </div>
                  {method.is_default && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
