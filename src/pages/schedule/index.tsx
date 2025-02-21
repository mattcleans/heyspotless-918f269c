
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/App";
import { Loadable } from "@/components/ui/loadable";
import { useToast } from "@/hooks/use-toast";
import { MapsLoader } from "@/components/ui/maps-loader";
import BookingHeader, { BookingStep } from "./components/BookingHeader";
import DateSelection from "./components/DateSelection";
import TimeSelection from "./components/TimeSelection";
import AddressAndNotes from "./components/AddressAndNotes";
import GuestInformation from "./components/GuestInformation";
import BookingConfirmation from "./components/BookingConfirmation";
import { Button } from "@/components/ui/button";

interface QuoteDetails {
  total: number;
  frequency: string;
  frequencyName: string;
  serviceTypeName: string;
}

interface LocationState {
  quoteDetails?: QuoteDetails;
  date?: Date;
  time?: string;
}

interface GuestInfo {
  email: string;
  phone: string;
}

const SchedulePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { userId } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<BookingStep>("date");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({ email: "", phone: "" });
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedFrequency, setSelectedFrequency] = useState("one-time");
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceTypeName, setServiceTypeName] = useState("");

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.quoteDetails) {
      setTotalPrice(state.quoteDetails.total);
      setSelectedFrequency(state.quoteDetails.frequency);
      setServiceTypeName(state.quoteDetails.serviceTypeName);
      setCurrentStep("address");
    }
  }, [location.state]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && selectedDate < new Date()) {
      toast({
        variant: "destructive",
        title: "Invalid Date",
        description: "Please select a future date"
      });
      return;
    }
    setDate(selectedDate);
  };

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      setAddress(place.formatted_address || "");
    }
  };

  const handleQuoteComplete = (price: number, frequency: string) => {
    setTotalPrice(price);
    setSelectedFrequency(frequency);
    setCurrentStep(userId ? "address" : "guest-info");
  };

  const handleBook = async () => {
    if (!date || !time || !address) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields"
      });
      return;
    }

    if (!userId && (!guestInfo.email || !guestInfo.phone)) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide your contact information"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: userId || null,
          date: date.toISOString().split('T')[0],
          time,
          address,
          notes,
          status: 'pending',
          price: totalPrice,
          frequency: selectedFrequency,
          service_type: serviceTypeName,
          guest_email: !userId ? guestInfo.email : null,
          guest_phone: !userId ? guestInfo.phone : null
        });

      if (bookingError) throw bookingError;

      setCurrentStep("confirmation");
      toast({
        title: "Booking Successful",
        description: "Your cleaning service has been scheduled."
      });
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "There was an error scheduling your cleaning service. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const content = (() => {
      switch (currentStep) {
        case "date":
          return (
            <DateSelection
              date={date}
              onDateSelect={handleDateSelect}
              onNext={() => setCurrentStep("time")}
            />
          );
        case "time":
          return (
            <TimeSelection
              time={time}
              onTimeSelect={setTime}
              onNext={() => setCurrentStep("quote")}
            />
          );
        case "quote":
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#0066B3] text-center">Select Your Service</h2>
              <Button
                className="w-full"
                onClick={() => navigate('/quotes', { state: { date, time } })}
              >
                Build New Quote
              </Button>
              {userId && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setCurrentStep("address")}
                >
                  Rebook Previous Service
                </Button>
              )}
            </div>
          );
        case "guest-info":
          return (
            <GuestInformation
              guestInfo={guestInfo}
              onGuestInfoChange={setGuestInfo}
              onNext={() => setCurrentStep("address")}
            />
          );
        case "address":
          return (
            <MapsLoader>
              <AddressAndNotes
                address={address}
                notes={notes}
                onAddressChange={setAddress}
                onNotesChange={setNotes}
                onBook={handleBook}
                onLoad={setAutocomplete}
                onPlaceChanged={handlePlaceSelect}
              />
            </MapsLoader>
          );
        case "confirmation":
          return (
            <BookingConfirmation
              date={date!}
              time={time!}
              address={address}
              price={totalPrice}
            />
          );
        default:
          return null;
      }
    })();

    return <Loadable loading={isSubmitting}>{content}</Loadable>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BookingHeader currentStep={currentStep} />
      <div className="max-w-md mx-auto mt-8">
        {renderStep()}
      </div>
    </div>
  );
};

export default SchedulePage;
