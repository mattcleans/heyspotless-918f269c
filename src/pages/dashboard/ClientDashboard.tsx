import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth";
import { WelcomeHeader } from "./components/WelcomeHeader";
import { QuickStats } from "./components/QuickStats";
import { UpcomingBookings } from "./components/UpcomingBookings";
import { AddressList } from "./components/AddressList";
import { PaymentMethodList } from "./components/PaymentMethodList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CalendarRange, MapPin, CreditCard, UserPlus, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const { userId, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const { data: upcomingBookings } = useQuery({
    queryKey: ['upcomingBookings', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          cleaner:cleaner_profiles!bookings_cleaner_id_fkey (
            id,
            hourly_rate,
            bio,
            created_at,
            status,
            availability,
            years_experience,
            ssn,
            background_check_acknowledgment,
            contractor_acknowledgment,
            work_eligibility_acknowledgment,
            emergency_contact_name,
            emergency_contact_email,
            emergency_contact_phone,
            profiles:profiles (
              user_type
            )
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'confirmed')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(5);

      if (error) throw error;

      // Transform data to match expected type
      return data?.map(booking => ({
        ...booking,
        cleaner: booking.cleaner && {
          ...booking.cleaner,
          profiles: booking.cleaner.profiles
        }
      })) ?? [];
    },
    enabled: isAuthenticated
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
    },
    enabled: isAuthenticated
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
    },
    enabled: isAuthenticated
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

      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <WelcomeHeader />
        
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-3xl font-bold text-[#1B365D]">Your Home, Our Priority</h2>
          <p className="text-lg text-[#1B365D]/70 max-w-2xl mx-auto">
            Professional cleaning services tailored to your needs. Get started in minutes!
          </p>
          <Button 
            size="lg" 
            className="bg-[#0066B3] hover:bg-[#0066B3]/90"
            onClick={() => navigate('/quotes')}
          >
            Get Your Free Quote <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Star className="h-10 w-10 text-[#0066B3]" />
                <h3 className="font-semibold text-lg">Top-Rated Service</h3>
                <p className="text-sm text-muted-foreground">
                  Experienced, background-checked, and highly rated cleaning professionals.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <CalendarRange className="h-10 w-10 text-[#0066B3]" />
                <h3 className="font-semibold text-lg">Flexible Scheduling</h3>
                <p className="text-sm text-muted-foreground">
                  Weekly, bi-weekly, or one-time cleaning services that fit your schedule.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <CreditCard className="h-10 w-10 text-[#0066B3]" />
                <h3 className="font-semibold text-lg">Simple Booking</h3>
                <p className="text-sm text-muted-foreground">
                  Easy online booking and secure payment processing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Get Started Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Get Started in 3 Easy Steps</CardTitle>
            <CardDescription>Here's how to book your first cleaning service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-[#0066B3] rounded-full p-2 text-white">
                  <UserPlus className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold">1. Create Your Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Sign up to manage your bookings and save your preferences.
                  </p>
                  <Button 
                    variant="link" 
                    className="px-0 text-[#0066B3]"
                    onClick={() => navigate('/auth')}
                  >
                    Create Account <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#0066B3] rounded-full p-2 text-white">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold">2. Build Your Quote</h4>
                  <p className="text-sm text-muted-foreground">
                    Select your rooms and services for a custom cleaning plan.
                  </p>
                  <Button 
                    variant="link" 
                    className="px-0 text-[#0066B3]"
                    onClick={() => navigate('/quotes')}
                  >
                    Get Quote <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#0066B3] rounded-full p-2 text-white">
                  <CalendarRange className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold">3. Schedule Your Clean</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred date and time for the service.
                  </p>
                  <Button 
                    variant="link" 
                    className="px-0 text-[#0066B3]"
                    onClick={() => navigate('/schedule')}
                  >
                    View Calendar <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Return dashboard for authenticated users
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
