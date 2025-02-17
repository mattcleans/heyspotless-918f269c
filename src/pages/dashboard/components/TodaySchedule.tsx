
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Booking = Database['public']['Tables']['bookings']['Row'];

interface TodayScheduleProps {
  bookings?: Booking[];
}

export const TodaySchedule = ({ bookings }: TodayScheduleProps) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
        <CardDescription>Your cleaning appointments for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings?.map((booking) => (
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
          {(!bookings || bookings.length === 0) && (
            <p className="text-muted-foreground text-center py-4">
              No bookings for today
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
