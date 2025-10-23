
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  cleaner: {
    id: string;
    hourly_rate: number | null;
    bio: string | null;
    years_experience: number | null;
  } | null;
};

interface UpcomingBookingsProps {
  bookings?: Booking[];
}

export const UpcomingBookings = ({ bookings }: UpcomingBookingsProps) => {
  const { toast } = useToast();

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Upcoming Cleans</CardTitle>
        <CardDescription>Your next scheduled cleaning services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings?.map((booking) => (
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
          {(!bookings || bookings.length === 0) && (
            <p className="text-muted-foreground text-center py-4">
              No upcoming bookings
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
