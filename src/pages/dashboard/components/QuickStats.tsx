
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Clock } from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  cleaner: {
    hourly_rate: number | null;
    bio: string | null;
  } | null;
};

type CleanerMatch = Database['public']['Tables']['client_cleaner_matches']['Row'] & {
  cleaner: {
    hourly_rate: number | null;
    bio: string | null;
    years_experience: number | null;
    first_name: string;
    last_name: string;
  } | null;
};

interface QuickStatsProps {
  upcomingBookings?: Booking[];
  currentCleaner?: CleanerMatch | null;
}

export const QuickStats = ({ upcomingBookings, currentCleaner }: QuickStatsProps) => {
  return (
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
  );
};
