
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
  DollarSign,
  Star,
  Clock,
  Users,
  Edit,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";

const StaffDashboard = () => {
  const { userId } = useAuthStore();
  const { toast } = useToast();

  const { data: cleanerProfile } = useQuery({
    queryKey: ['cleanerProfile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cleaner_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: upcomingBookings } = useQuery({
    queryKey: ['upcomingBookings', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('cleaner_id', userId)
        .eq('status', 'confirmed')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  const { data: earnings } = useQuery({
    queryKey: ['earnings', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('earnings')
        .select('*')
        .eq('cleaner_id', userId)
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewee_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  // Calculate average rating
  const averageRating = reviews?.length 
    ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length 
    : 0;

  // Calculate total earnings
  const totalEarnings = earnings?.reduce((acc, earn) => acc + Number(earn.amount) + Number(earn.tip_amount), 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1B365D]">Cleaner Dashboard</h1>
        <Button variant="outline" onClick={() => toast({ description: "Profile edit coming soon!" })}>
          <Edit className="w-4 h-4 mr-2" /> Edit Profile
        </Button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Cleans</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingBookings?.filter(b => 
                new Date(b.date).toDateString() === new Date().toDateString()
              ).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageRating.toFixed(1)} / 5.0
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalEarnings.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${cleanerProfile?.hourly_rate || '0'}/hr
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your cleaning appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBookings?.map((booking) => (
                <div 
                  key={booking.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{booking.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.date), 'h:mm a')} - {booking.duration} minutes
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">
                    Start Clean
                  </Button>
                </div>
              ))}
              {(!upcomingBookings || upcomingBookings.length === 0) && (
                <p className="text-muted-foreground text-center py-4">
                  No bookings for today
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>What your clients are saying</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews?.map((review) => (
                <div key={review.id} className="space-y-2 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(review.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Earnings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Earnings</CardTitle>
            <CardDescription>Your latest payments and tips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {earnings?.map((earning) => (
                <div key={earning.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">${(Number(earning.amount) + Number(earning.tip_amount)).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(earning.created_at), 'MMM d, yyyy')}
                      {earning.tip_amount > 0 && ` (includes $${Number(earning.tip_amount).toFixed(2)} tip)`}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffDashboard;
