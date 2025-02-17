
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/App";
import { WelcomeHeader } from "./components/WelcomeHeader";
import { QuickStats } from "./components/QuickStats";
import { UpcomingBookings } from "./components/UpcomingBookings";
import { AddressList } from "./components/AddressList";
import { PaymentMethodList } from "./components/PaymentMethodList";

const ClientDashboard = () => {
  const { userId } = useAuthStore();

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
            profiles:cleaner_profiles_id_fkey (user_type)
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
            profiles:cleaner_profiles_id_fkey (user_type)
          )
        `)
        .eq('client_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <WelcomeHeader />
      <QuickStats 
        upcomingBookings={upcomingBookings} 
        currentCleaner={currentCleaner} 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingBookings bookings={upcomingBookings} />
        <AddressList addresses={addresses} />
        <PaymentMethodList paymentMethods={paymentMethods} />
      </div>
    </div>
  );
};

export default ClientDashboard;
