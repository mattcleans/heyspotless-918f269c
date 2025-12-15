import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Loader2, Calendar, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PriceEstimate } from '@/pages/book/components/PriceEstimate';
import { toast } from 'sonner';
import { createHCPBooking } from '@/services/housecallPro';
import { format, addDays } from 'date-fns';

const bookingSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  propertySize: z.string().min(1, 'Property size is required'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  preferredTime: z.string().min(1, 'Preferred time is required'),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookServiceFormProps {
  formRef?: React.RefObject<HTMLDivElement>;
}

export function BookServiceForm({ formRef }: BookServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceType, setServiceType] = useState('standard');
  const [frequency, setFrequency] = useState('biweekly');
  const [propertySize, setPropertySize] = useState('0-1500');
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceType: 'standard',
      frequency: 'biweekly',
      propertySize: '0-1500',
      preferredDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      preferredTime: '09:00',
    },
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

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'standard': return 'Standard Cleaning';
      case 'deep': return 'Deep Cleaning';
      case 'move': return 'Move-In/Out Cleaning';
      default: return 'Standard Cleaning';
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createHCPBooking({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        date: data.preferredDate,
        time: data.preferredTime,
        service_type: getServiceTypeLabel(data.serviceType),
        notes: `Frequency: ${data.frequency}, Property Size: ${data.propertySize} sq ft. ${data.notes || ''}`,
        total_amount: calculateEstimate(data.serviceType, data.frequency, data.propertySize),
      });

      toast.success(`Booking confirmed! Reference: ${result.job_number}`, {
        description: 'We will contact you shortly to confirm your appointment.',
      });
      
      reset();
      
      // Navigate to confirmation or schedule page
      navigate('/schedule', {
        state: {
          bookingConfirmed: true,
          jobNumber: result.job_number,
          quoteDetails: {
            total: calculateEstimate(data.serviceType, data.frequency, data.propertySize),
            frequency: data.frequency,
            serviceTypeName: getServiceTypeLabel(data.serviceType),
          }
        }
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to submit booking request', {
        description: 'Please try again or call us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEstimate = (service: string, freq: string, size: string) => {
    const basePrices: Record<string, number> = { standard: 150, deep: 250, move: 350 };
    const sizeMultipliers: Record<string, number> = { '0-1500': 1.0, '1501-2500': 1.3, '2501-3500': 1.6, '3501+': 2.0 };
    const freqDiscounts: Record<string, number> = { weekly: 0.80, biweekly: 0.90, monthly: 0.95, 'one-time': 1.0 };
    return Math.round((basePrices[service] || 150) * (sizeMultipliers[size] || 1.0) * (freqDiscounts[freq] || 1.0));
  };

  // Generate date options for next 14 days
  const dateOptions = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i + 1);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEEE, MMM d'),
    };
  });

  const timeOptions = [
    { value: '08:00', label: '8:00 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
  ];

  return (
    <div ref={formRef} className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg">
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

        {/* Service Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Service Type</Label>
            <Select
              value={serviceType}
              onValueChange={(val) => {
                setServiceType(val);
                setValue('serviceType', val);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Cleaning</SelectItem>
                <SelectItem value="deep">Deep Cleaning</SelectItem>
                <SelectItem value="move">Move-In/Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(val) => {
                setFrequency(val);
                setValue('frequency', val);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="one-time">One-Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Property Size</Label>
            <Select
              value={propertySize}
              onValueChange={(val) => {
                setPropertySize(val);
                setValue('propertySize', val);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1500">0 - 1,500 sq ft</SelectItem>
                <SelectItem value="1501-2500">1,501 - 2,500 sq ft</SelectItem>
                <SelectItem value="2501-3500">2,501 - 3,500 sq ft</SelectItem>
                <SelectItem value="3501+">3,501+ sq ft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date & Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Preferred Date
            </Label>
            <Select
              defaultValue={format(addDays(new Date(), 2), 'yyyy-MM-dd')}
              onValueChange={(val) => setValue('preferredDate', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a date" />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.preferredDate && (
              <p className="text-xs text-destructive">{errors.preferredDate.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Preferred Time
            </Label>
            <Select
              defaultValue="09:00"
              onValueChange={(val) => setValue('preferredTime', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.preferredTime && (
              <p className="text-xs text-destructive">{errors.preferredTime.message}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any special requests or instructions..."
            {...register('notes')}
            rows={3}
          />
        </div>

        {/* Price Estimate */}
        <PriceEstimate
          serviceType={serviceType}
          frequency={frequency}
          propertySize={propertySize}
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Booking...
            </>
          ) : (
            'Complete Booking'
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By booking, you agree to our terms of service and privacy policy.
        </p>
      </form>
    </div>
  );
}
