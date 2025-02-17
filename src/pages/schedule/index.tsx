
import { useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";

import BookingHeader from "./components/BookingHeader";
import DateSelection from "./components/DateSelection";
import TimeSelection from "./components/TimeSelection";
import AddressAndNotes from "./components/AddressAndNotes";
import BookingConfirmation from "./components/BookingConfirmation";

const libraries = ["places"];

const BookingPage = () => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>("");
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoogleMapsKey = async () => {
      const { data: secrets, error } = await supabase
        .rpc('get_secret', { secret_name: 'GOOGLE_MAPS_API_KEY' });
      
      if (error) {
        console.error('Error fetching Google Maps API key:', error);
        return;
      }
      
      if (secrets) {
        setGoogleMapsApiKey(secrets);
      }
    };

    fetchGoogleMapsKey();
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
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
      
      const { error } = await supabase
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

  if (!googleMapsApiKey) return <div>Loading...</div>;
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;
  if (!userId) return <div>Loading...</div>;

  return (
    <div className="mx-auto max-w-xl animate-fade-in">
      <BookingHeader />

      {step === 1 && (
        <DateSelection
          date={date}
          onDateSelect={setDate}
          onNext={handleNext}
        />
      )}

      {step === 2 && (
        <TimeSelection
          time={time}
          onTimeSelect={setTime}
          onNext={handleNext}
        />
      )}

      {step === 3 && (
        <AddressAndNotes
          address={address}
          notes={notes}
          onAddressChange={setAddress}
          onNotesChange={setNotes}
          onBook={handleBook}
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
        />
      )}

      {step === 4 && date && time && (
        <BookingConfirmation
          date={date}
          time={time}
          address={address}
        />
      )}
    </div>
  );
};

export default BookingPage;
