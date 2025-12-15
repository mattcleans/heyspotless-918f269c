import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HCP_API_BASE = 'https://api.housecallpro.com';

interface CustomerData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
}

interface JobData {
  customer_id: string;
  address: string;
  scheduled_start: string;
  scheduled_end: string;
  service_type: string;
  notes?: string;
  total_amount: number;
}

async function makeHCPRequest(endpoint: string, method: string, body?: any) {
  const apiKey = Deno.env.get('HOUSECALL_PRO_API_KEY');
  
  if (!apiKey) {
    throw new Error('HOUSECALL_PRO_API_KEY is not configured');
  }

  const response = await fetch(`${HCP_API_BASE}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('HCP API Error:', response.status, data);
    throw new Error(data.message || `HCP API error: ${response.status}`);
  }

  return data;
}

// Create or find a customer in Housecall Pro
async function createCustomer(customerData: CustomerData) {
  console.log('Creating customer in HCP:', customerData.email);
  
  // First, try to find existing customer by email
  try {
    const searchResult = await makeHCPRequest(`/customers?email=${encodeURIComponent(customerData.email)}`, 'GET');
    
    if (searchResult.customers && searchResult.customers.length > 0) {
      console.log('Found existing customer:', searchResult.customers[0].id);
      return searchResult.customers[0];
    }
  } catch (error) {
    console.log('Customer search failed, will create new:', error);
  }

  // Parse address into components (basic parsing)
  const addressParts = customerData.address.split(',').map(s => s.trim());
  const street = addressParts[0] || '';
  const city = addressParts[1] || '';
  const stateZip = addressParts[2] || '';
  const [state, zip] = stateZip.split(' ').filter(Boolean);

  // Create new customer
  const newCustomer = await makeHCPRequest('/customers', 'POST', {
    first_name: customerData.first_name,
    last_name: customerData.last_name,
    email: customerData.email,
    mobile_number: customerData.phone,
    addresses: [{
      street: street,
      city: city,
      state: state || '',
      zip: zip || '',
      country: 'US'
    }]
  });

  console.log('Created new customer:', newCustomer.id);
  return newCustomer;
}

// Create a job in Housecall Pro
async function createJob(jobData: JobData) {
  console.log('Creating job in HCP for customer:', jobData.customer_id);

  // Parse address
  const addressParts = jobData.address.split(',').map(s => s.trim());
  const street = addressParts[0] || '';
  const city = addressParts[1] || '';
  const stateZip = addressParts[2] || '';
  const [state, zip] = stateZip.split(' ').filter(Boolean);

  const job = await makeHCPRequest('/jobs', 'POST', {
    customer_id: jobData.customer_id,
    address: {
      street: street,
      city: city,
      state: state || '',
      zip: zip || '',
      country: 'US'
    },
    schedule: {
      scheduled_start: jobData.scheduled_start,
      scheduled_end: jobData.scheduled_end,
    },
    line_items: [{
      name: jobData.service_type,
      description: `Cleaning Service - ${jobData.service_type}`,
      unit_price: jobData.total_amount * 100, // HCP uses cents
      quantity: 1
    }],
    note: jobData.notes || '',
    work_status: 'scheduled'
  });

  console.log('Created job:', job.id);
  return job;
}

// Get job status from Housecall Pro
async function getJob(jobId: string) {
  console.log('Fetching job from HCP:', jobId);
  return await makeHCPRequest(`/jobs/${jobId}`, 'GET');
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace('/housecall-pro', '');

    // Route: POST /customers
    if (req.method === 'POST' && path === '/customers') {
      const customerData: CustomerData = await req.json();
      const customer = await createCustomer(customerData);
      return new Response(JSON.stringify(customer), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: POST /jobs
    if (req.method === 'POST' && path === '/jobs') {
      const jobData: JobData = await req.json();
      const job = await createJob(jobData);
      return new Response(JSON.stringify(job), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: GET /jobs/:id
    if (req.method === 'GET' && path.startsWith('/jobs/')) {
      const jobId = path.replace('/jobs/', '');
      const job = await getJob(jobId);
      return new Response(JSON.stringify(job), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: POST /customers-only - Create customer only (for lead capture)
    if (req.method === 'POST' && path === '/customers-only') {
      const customerData = await req.json();
      
      const customer = await createCustomer({
        first_name: customerData.first_name || 'Guest',
        last_name: customerData.last_name || 'Customer',
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
      });

      console.log('Customer created/found for lead capture:', customer.id);

      return new Response(JSON.stringify({
        success: true,
        customer_id: customer.id,
        customer_name: `${customerData.first_name} ${customerData.last_name}`,
        email: customerData.email,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route: POST /book - Combined customer + job creation
    if (req.method === 'POST' && path === '/book') {
      const bookingData = await req.json();
      
      // Step 1: Create or find customer
      const customer = await createCustomer({
        first_name: bookingData.first_name || 'Guest',
        last_name: bookingData.last_name || 'Customer',
        email: bookingData.email,
        phone: bookingData.phone,
        address: bookingData.address,
      });

      // Step 2: Create job
      const scheduledStart = new Date(`${bookingData.date}T${bookingData.time}`);
      const scheduledEnd = new Date(scheduledStart.getTime() + (bookingData.duration || 2) * 60 * 60 * 1000);

      const job = await createJob({
        customer_id: customer.id,
        address: bookingData.address,
        scheduled_start: scheduledStart.toISOString(),
        scheduled_end: scheduledEnd.toISOString(),
        service_type: bookingData.service_type,
        notes: bookingData.notes,
        total_amount: bookingData.total_amount,
      });

      return new Response(JSON.stringify({
        success: true,
        customer_id: customer.id,
        job_id: job.id,
        job_number: job.job_number || job.id,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Housecall Pro function error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
