
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Star, DollarSign, Clock } from "lucide-react";
import { startOfWeek, endOfWeek } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Booking = Database['public']['Tables']['bookings']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];
type Earning = Database['public']['Tables']['earnings']['Row'];
type CleanerProfile = Database['public']['Tables']['cleaner_profiles']['Row'];

interface StaffStatsProps {
  upcomingBookings?: Booking[];
  reviews?: Review[];
  earnings?: Earning[];
  cleanerProfile?: CleanerProfile;
}

export const StaffStats = ({ upcomingBookings, reviews, earnings, cleanerProfile }: StaffStatsProps) => {
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
  const endOfCurrentWeek = endOfWeek(new Date(), { weekStartsOn: 1 }); // Sunday

  const averageRating = reviews?.length 
    ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length 
    : 0;

  const currentWeekEarnings = earnings?.filter(
    earn => {
      const earnDate = new Date(earn.created_at);
      return earnDate >= startOfCurrentWeek && earnDate <= endOfCurrentWeek;
    }
  );

  const totalEarnings = currentWeekEarnings?.reduce(
    (acc, earn) => acc + Number(earn.amount) + Number(earn.tip_amount), 0
  ) || 0;

  const todayBookings = upcomingBookings?.filter(b => 
    new Date(b.date).toDateString() === new Date().toDateString()
  ).length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Cleans</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayBookings}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageRating.toFixed(1)} / 5.0</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Week</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${cleanerProfile?.hourly_rate || '0'}/hr</div>
        </CardContent>
      </Card>
    </div>
  );
};
