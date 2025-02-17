
import { useState, useEffect } from "react";
import { FrequencySelector } from "./components/FrequencySelector";
import { RoomSelector } from "./components/RoomSelector";
import { ExtrasSelector } from "./components/ExtrasSelector";
import { QuoteSummary } from "./components/QuoteSummary";
import { ServiceTypeSelector } from "./components/ServiceTypeSelector";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RoomCounts {
  [key: string]: number;
}

interface CleaningFrequency {
  id: string;
  name: string;
  priceMultiplier: number;
}

interface ExtraService {
  name: string;
  price: number;
}

interface ServiceType {
  id: string;
  type: 'standard' | 'deep' | 'move';
  name: string;
  price_multiplier: number;
  description: string;
}

const frequencies: CleaningFrequency[] = [
  { id: "one-time", name: "One Time", priceMultiplier: 1 },
  { id: "monthly", name: "Monthly Clean", priceMultiplier: 0.9 },
  { id: "bi-weekly", name: "Bi-Weekly Clean", priceMultiplier: 0.85 },
  { id: "weekly", name: "Weekly Clean", priceMultiplier: 0.8 },
];

const rooms = {
  Bedroom: 17.50,
  Bathroom: 20.00,
  "Half Bathroom": 12.00,
  "Dining Room": 15.00,
  "Living Room": 15.00,
  Kitchen: 25.00,
  "Media Room": 15.00,
  "Game Room": 15.00,
  "Utility Room": 10.00,
  Office: 15.00,
};

const extraServices: ExtraService[] = [
  { name: "Laundry Service", price: 20.00 },
  { name: "Refrigerator Clean", price: 30.00 },
  { name: "Oven Clean", price: 30.00 },
  { name: "Inside Cabinets", price: 50.00 },
  { name: "Pet Hair Service - Level 1", price: 50.00 },
  { name: "Pet Hair Service - Level 2", price: 100.00 },
  { name: "Pet Hair Service - Level 3", price: 150.00 },
  { name: "Closet/Pantry Organization", price: 110.00 },
];

const QuotePage = () => {
  const [selectedFrequency, setSelectedFrequency] = useState<string>("one-time");
  const [roomCounts, setRoomCounts] = useState<RoomCounts>({});
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(60);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      const { data, error } = await supabase
        .from('service_types')
        .select('*')
        .order('price_multiplier');

      if (error) {
        toast.error('Error fetching service types');
        return;
      }

      setServiceTypes(data);
      if (data.length > 0) {
        setSelectedServiceType(data[0]); // Set standard clean as default
      }
    };

    fetchServiceTypes();
  }, []);

  const updateRoomCount = (room: string, increment: boolean) => {
    setRoomCounts((prev) => ({
      ...prev,
      [room]: Math.max(0, (prev[room] || 0) + (increment ? 1 : -1)),
    }));
  };

  const toggleExtra = (serviceName: string) => {
    setSelectedExtras((prev) =>
      prev.includes(serviceName)
        ? prev.filter((name) => name !== serviceName)
        : [...prev, serviceName]
    );
  };

  useEffect(() => {
    const frequencyMultiplier =
      frequencies.find((f) => f.id === selectedFrequency)?.priceMultiplier || 1;

    const serviceTypeMultiplier = selectedServiceType?.price_multiplier || 1;

    const roomsTotal = Object.entries(roomCounts).reduce(
      (sum, [room, count]) => sum + (rooms[room as keyof typeof rooms] * count),
      0
    );

    const extrasTotal = selectedExtras.reduce(
      (sum, extra) =>
        sum + (extraServices.find((service) => service.name === extra)?.price || 0),
      0
    );

    const arrivalFee = 60 * frequencyMultiplier;
    const calculatedTotal = (roomsTotal * frequencyMultiplier * serviceTypeMultiplier) + extrasTotal + arrivalFee;
    setTotal(calculatedTotal);
  }, [selectedFrequency, roomCounts, selectedExtras, selectedServiceType]);

  const handleBookNow = () => {
    console.log("Book now clicked");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in p-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-[#0066B3]">Build Your Quote</h1>
        <p className="text-[#1B365D]/60">
          Customize your cleaning service package
        </p>
      </div>

      <ServiceTypeSelector
        serviceTypes={serviceTypes}
        selectedServiceType={selectedServiceType}
        onServiceTypeChange={setSelectedServiceType}
      />

      <FrequencySelector
        frequencies={frequencies}
        selectedFrequency={selectedFrequency}
        onFrequencyChange={setSelectedFrequency}
      />

      <RoomSelector
        rooms={rooms}
        roomCounts={roomCounts}
        onUpdateRoomCount={updateRoomCount}
      />

      <ExtrasSelector
        extraServices={extraServices}
        selectedExtras={selectedExtras}
        onToggleExtra={toggleExtra}
      />

      <QuoteSummary
        total={total}
        frequencyName={frequencies.find((f) => f.id === selectedFrequency)?.name || ""}
        serviceTypeName={selectedServiceType?.name || ""}
        onBookNow={handleBookNow}
      />
    </div>
  );
};

export default QuotePage;
