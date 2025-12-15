import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createHCPCustomer } from '@/services/housecallPro';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  notes: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface BookingFormProps {
  formRef?: React.RefObject<HTMLDivElement>;
}

export function BookingForm({ formRef }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!addressInputRef.current || !window.google?.maps?.places) return;

    autocompleteRef.current = new google.maps.places.Autocomplete(addressInputRef.current, {
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'address_components'],
      types: ['address'],
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.formatted_address) {
        setValue('address', place.formatted_address);
      }
    });
  }, [setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Create customer in HCP
      const result = await createHCPCustomer({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
      });

      toast.success('Information saved!', {
        description: 'Now let\'s build your custom quote.',
      });

      // Navigate to quotes page with customer data
      navigate('/quotes', {
        state: {
          customerData: {
            customerId: result.customer_id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            notes: data.notes,
          }
        }
      });
    } catch (error) {
      console.error('Customer creation error:', error);
      toast.error('Failed to save information', {
        description: 'Please try again or call us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={formRef} className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-foreground mb-2">Get Started</h2>
      <p className="text-muted-foreground mb-6">Enter your information and we'll help you build a custom quote.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="John"
              {...register('firstName')}
              className={errors.firstName ? 'border-destructive' : ''}
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Smith"
              {...register('lastName')}
              className={errors.lastName ? 'border-destructive' : ''}
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(469) 280-0397"
              {...register('phone')}
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Service Address</Label>
          <Input
            id="address"
            placeholder="Enter your full address"
            {...register('address')}
            ref={addressInputRef}
            className={errors.address ? 'border-destructive' : ''}
          />
          {errors.address && (
            <p className="text-xs text-destructive">{errors.address.message}</p>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Message (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any special requests or questions..."
            {...register('notes')}
            rows={3}
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-lg font-semibold bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            'Send My Message'
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By submitting, you agree to be contacted about your cleaning request.
        </p>
      </form>
    </div>
  );
}
