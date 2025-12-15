import { supabase } from "@/integrations/supabase/client";

interface BookingData {
  first_name?: string;
  last_name?: string;
  email: string;
  phone: string;
  address: string;
  date: string;
  time: string;
  service_type: string;
  notes?: string;
  total_amount: number;
  duration?: number;
}

interface CustomerData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

interface HCPBookingResult {
  success: boolean;
  customer_id: string;
  job_id: string;
  job_number: string;
}

interface HCPCustomerResult {
  success: boolean;
  customer_id: string;
  customer_name: string;
  email: string;
}

export async function createHCPBooking(bookingData: BookingData): Promise<HCPBookingResult> {
  const { data, error } = await supabase.functions.invoke('housecall-pro/book', {
    body: bookingData,
  });

  if (error) {
    console.error('HCP booking error:', error);
    throw new Error(error.message || 'Failed to create booking in Housecall Pro');
  }

  return data as HCPBookingResult;
}

export async function getHCPJobStatus(jobId: string) {
  const { data, error } = await supabase.functions.invoke(`housecall-pro/jobs/${jobId}`, {
    method: 'GET',
  });

  if (error) {
    console.error('HCP job status error:', error);
    throw new Error(error.message || 'Failed to get job status');
  }

  return data;
}

export async function createHCPCustomer(customerData: CustomerData): Promise<HCPCustomerResult> {
  const { data, error } = await supabase.functions.invoke('housecall-pro/customers-only', {
    body: customerData,
  });

  if (error) {
    console.error('HCP customer creation error:', error);
    throw new Error(error.message || 'Failed to create customer in Housecall Pro');
  }

  return data as HCPCustomerResult;
}
