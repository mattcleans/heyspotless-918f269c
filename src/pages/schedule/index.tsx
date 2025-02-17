import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Star } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const libraries = ["places"];

const BookingPage = () => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyALT9I9449_IzUWgWYFh5U0eIuWA2UBBQU",
    libraries: libraries as ["places"],
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to make a booking");
        navigate("/");
        return;
      }
      setUserId(user.id);
    };
    
    checkUser();
  }, [navigate]);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setAddress(place.formatted_address);
      }
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBook = async () => {
    if (!date || !userId) return;
    
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          date: formattedDate,
          time: time || '',
          address,
          notes,
          status: 'pending',
          user_id: userId
        });

      if (error) {
        toast.error("Failed to create booking");
        throw error;
      }
      
      toast.success("Booking created successfully!");
      setStep(step + 1);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;
  if (!userId) return <div>Loading...</div>;

  return (
    <div className="mx-auto max-w-xl animate-fade-in">
      {/* Logo and Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <img 
            src="/lovable-uploads/bbb5176c-dbed-4e4a-8029-a3982064c2ea.png" 
            alt="Hey Spotless Logo" 
            className="h-12 object-contain"
          />
        </div>
        <p className="text-[#1B365D]">Dallas Cleaning Professionals</p>
        <p className="text-sm text-[#1B365D]/60 mt-1">GOODBYE SPOTS • HELLO SPARKLE</p>
      </div>

      {/* Step 1: Date Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0066B3] text-center">PICK A DAY</h2>
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          <Button
            onClick={handleNext}
            disabled={!date}
            className="w-full bg-[#0066B3] hover:bg-[#0066B3]/90"
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 2: Time Selection */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0066B3] text-center">PICK A TIME</h2>
          <div className="grid grid-cols-2 gap-4">
            {timeSlots.map((slot) => (
              <Button
                key={slot}
                variant={time === slot ? "default" : "outline"}
                className={cn(
                  "h-12",
                  time === slot && "bg-[#0066B3] hover:bg-[#0066B3]/90"
                )}
                onClick={() => setTime(slot)}
              >
                {slot}
              </Button>
            ))}
          </div>
          <Button
            onClick={handleNext}
            disabled={!time}
            className="w-full bg-[#0066B3] hover:bg-[#0066B3]/90"
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 3: Address and Notes */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-[#0066B3] mb-2">ADDRESS:</h3>
              <Autocomplete
                onLoad={onLoad}
                onPlaceChanged={onPlaceChanged}
              >
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="w-full"
                />
              </Autocomplete>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#0066B3] mb-2">ANY NOTES FOR US?</h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special instructions or requests..."
                className="w-full h-32"
              />
            </div>
          </div>
          <Button
            onClick={handleBook}
            disabled={!address}
            className="w-full bg-[#0066B3] hover:bg-[#0066B3]/90"
          >
            BOOK
          </Button>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-[#0066B3]">BOOKING CONFIRMED</h2>
          <div className="space-y-2 text-[#1B365D]">
            <p>WE WILL SEE YOU ON {format(date!, "EEEE")},</p>
            <p>{format(date!, "MMMM do")} AT {time}</p>
            <p className="mt-4">{address}</p>
          </div>
          <Button
            variant="outline"
            className="w-full border-[#0066B3] text-[#0066B3]"
          >
            REFER A FRIEND
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
