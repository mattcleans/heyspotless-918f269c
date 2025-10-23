-- Add missing columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add missing columns to cleaner_profiles
ALTER TABLE public.cleaner_profiles ADD COLUMN IF NOT EXISTS ssn TEXT;
ALTER TABLE public.cleaner_profiles ADD COLUMN IF NOT EXISTS contractor_acknowledgment BOOLEAN DEFAULT false;
ALTER TABLE public.cleaner_profiles ADD COLUMN IF NOT EXISTS work_eligibility_acknowledgment BOOLEAN DEFAULT false;
ALTER TABLE public.cleaner_profiles ADD COLUMN IF NOT EXISTS background_check_acknowledgment BOOLEAN DEFAULT false;
ALTER TABLE public.cleaner_profiles ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE public.cleaner_profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add missing columns to payment_methods
ALTER TABLE public.payment_methods ADD COLUMN IF NOT EXISTS card_type TEXT;
ALTER TABLE public.payment_methods ADD COLUMN IF NOT EXISTS expiry_month INTEGER;
ALTER TABLE public.payment_methods ADD COLUMN IF NOT EXISTS expiry_year INTEGER;

-- Add missing columns to earnings
ALTER TABLE public.earnings ADD COLUMN IF NOT EXISTS tip_amount DECIMAL(10, 2) DEFAULT 0;

-- Add missing columns to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS duration INTEGER;

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cleaner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_types table
CREATE TABLE IF NOT EXISTS public.service_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_multiplier DECIMAL(10, 2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;

-- Reviews RLS policies
CREATE POLICY "Users can view reviews for their bookings"
  ON public.reviews FOR SELECT
  USING (auth.uid() = customer_id OR auth.uid() = cleaner_id);

CREATE POLICY "Customers can create reviews for their bookings"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = customer_id);

-- Service types RLS policies (public read)
CREATE POLICY "Anyone can view service types"
  ON public.service_types FOR SELECT
  USING (true);

-- Add triggers for new tables
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_types_updated_at
  BEFORE UPDATE ON public.service_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default service types
INSERT INTO public.service_types (type, name, description, price_multiplier)
VALUES 
  ('standard', 'Standard Cleaning', 'Regular cleaning service', 1.0),
  ('deep', 'Deep Cleaning', 'Thorough deep cleaning service', 1.5),
  ('move_in', 'Move In/Out', 'Complete cleaning for moving', 1.8),
  ('office', 'Office Cleaning', 'Commercial office cleaning', 1.2)
ON CONFLICT (type) DO NOTHING;