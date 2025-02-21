
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/App";
import { startOfWeek, endOfWeek, addWeeks } from "date-fns";
import { WelcomeHeader } from "./components/WelcomeHeader";
import { StaffStats } from "./components/StaffStats";
import { TodaySchedule } from "./components/TodaySchedule";
import { RecentReviews } from "./components/RecentReviews";
import { RecentEarnings } from "./components/RecentEarnings";
import { UpcomingBookings } from "./components/UpcomingBookings";

const StaffDashboard = () => {
  const { userId } = useAuthStore();

  // Get next week's date range
  const nextWeekStart = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), 1);
  const nextWeekEnd = endOfWeek(nextWeekStart, { weekStartsOn: 1 });

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

  const { data: nextWeekBookings } = useQuery({
    queryKey: ['nextWeekBookings', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          cleaner:cleaner_profiles!bookings_cleaner_id_fkey(
            id,
            hourly_rate,
            bio,
            created_at,
            status,
            availability,
            years_experience,
            profile:profiles(
              user_type
            )
          )
        `)
        .eq('cleaner_id', userId)
        .eq('status', 'confirmed')
        .gte('date', nextWeekStart.toISOString())
        .lte('date', nextWeekEnd.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;
      
      // Transform data to match expected type
      return data?.map(booking => ({
        ...booking,
        cleaner: booking.cleaner && {
          ...booking.cleaner,
          profiles: booking.cleaner.profile
        }
      })) ?? [];
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

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <WelcomeHeader />
      <StaffStats 
        upcomingBookings={upcomingBookings}
        reviews={reviews}
        earnings={earnings}
        cleanerProfile={cleanerProfile}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TodaySchedule bookings={upcomingBookings} />
        <UpcomingBookings bookings={nextWeekBookings} />
        <RecentReviews reviews={reviews} />
        <RecentEarnings earnings={earnings} />
      </div>
    </div>
  );
};

export default StaffDashboard;
