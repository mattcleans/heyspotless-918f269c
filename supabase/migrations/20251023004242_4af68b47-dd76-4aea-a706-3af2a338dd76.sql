-- Add missing foreign key relationships for proper Supabase joins
-- Use DROP CONSTRAINT IF EXISTS to avoid errors if they already exist

-- Drop and recreate bookings foreign keys
ALTER TABLE public.bookings
DROP CONSTRAINT IF EXISTS bookings_customer_id_fkey;

ALTER TABLE public.bookings
ADD CONSTRAINT bookings_customer_id_fkey 
FOREIGN KEY (customer_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Drop and recreate client_cleaner_matches foreign keys
ALTER TABLE public.client_cleaner_matches
DROP CONSTRAINT IF EXISTS client_cleaner_matches_cleaner_id_fkey,
DROP CONSTRAINT IF EXISTS client_cleaner_matches_client_id_fkey;

ALTER TABLE public.client_cleaner_matches
ADD CONSTRAINT client_cleaner_matches_cleaner_id_fkey 
FOREIGN KEY (cleaner_id) 
REFERENCES public.cleaner_profiles(id) 
ON DELETE CASCADE,
ADD CONSTRAINT client_cleaner_matches_client_id_fkey 
FOREIGN KEY (client_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Drop and recreate earnings foreign key
ALTER TABLE public.earnings
DROP CONSTRAINT IF EXISTS earnings_cleaner_id_fkey;

ALTER TABLE public.earnings
ADD CONSTRAINT earnings_cleaner_id_fkey 
FOREIGN KEY (cleaner_id) 
REFERENCES public.cleaner_profiles(id) 
ON DELETE CASCADE;

-- Drop and recreate reviews foreign keys
ALTER TABLE public.reviews
DROP CONSTRAINT IF EXISTS reviews_cleaner_id_fkey,
DROP CONSTRAINT IF EXISTS reviews_customer_id_fkey;

ALTER TABLE public.reviews
ADD CONSTRAINT reviews_cleaner_id_fkey 
FOREIGN KEY (cleaner_id) 
REFERENCES public.cleaner_profiles(id) 
ON DELETE CASCADE,
ADD CONSTRAINT reviews_customer_id_fkey 
FOREIGN KEY (customer_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;