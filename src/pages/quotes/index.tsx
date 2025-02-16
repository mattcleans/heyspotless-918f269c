
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Calculator,
  Check,
  DollarSign,
  Home,
  Plus,
  Minus,
} from "lucide-react";

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
  const [total, setTotal] = useState<number>(60); // Starting with arrival fee

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

    // Calculate rooms total
    const roomsTotal = Object.entries(roomCounts).reduce(
      (sum, [room, count]) => sum + (rooms[room as keyof typeof rooms] * count),
      0
    );

    // Calculate extras total
    const extrasTotal = selectedExtras.reduce(
      (sum, extra) =>
        sum + (extraServices.find((service) => service.name === extra)?.price || 0),
      0
    );

    // Base arrival fee with frequency multiplier
    const arrivalFee = 60 * frequencyMultiplier;

    // Calculate final total
    const calculatedTotal = (roomsTotal * frequencyMultiplier) + extrasTotal + arrivalFee;
    setTotal(calculatedTotal);
  }, [selectedFrequency, roomCounts, selectedExtras]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in p-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-[#0066B3]">Build Your Quote</h1>
        <p className="text-[#1B365D]/60">
          Customize your cleaning service package
        </p>
      </div>

      {/* Frequency Selection */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-[#1B365D] mb-4">
          Service Frequency
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {frequencies.map((frequency) => (
            <Button
              key={frequency.id}
              variant={selectedFrequency === frequency.id ? "default" : "outline"}
              className={selectedFrequency === frequency.id ? "bg-[#0066B3]" : ""}
              onClick={() => setSelectedFrequency(frequency.id)}
            >
              {frequency.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Room Selection */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-[#1B365D] mb-4">
          Select Your Rooms
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(rooms).map(([room, price]) => (
            <div
              key={room}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium text-[#1B365D]">{room}</p>
                <p className="text-sm text-[#1B365D]/60">
                  ${price.toFixed(2)} per room
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateRoomCount(room, false)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{roomCounts[room] || 0}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateRoomCount(room, true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Extra Services */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-[#1B365D] mb-4">
          Extra Services
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {extraServices.map((service) => (
            <div
              key={service.name}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                selectedExtras.includes(service.name)
                  ? "border-[#0066B3] bg-[#0066B3]/5"
                  : ""
              }`}
              onClick={() => toggleExtra(service.name)}
            >
              <div>
                <p className="font-medium text-[#1B365D]">{service.name}</p>
                <p className="text-sm text-[#1B365D]/60">
                  ${service.price.toFixed(2)}
                </p>
              </div>
              {selectedExtras.includes(service.name) && (
                <Check className="h-5 w-5 text-[#0066B3]" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Quote Summary */}
      <Card className="p-6 bg-[#0066B3] text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Total Estimate</h2>
            <p className="text-white/80">
              {frequencies.find((f) => f.id === selectedFrequency)?.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">${total.toFixed(2)}</p>
            <p className="text-white/80">per service</p>
          </div>
        </div>
        <Button
          className="w-full mt-4 bg-white text-[#0066B3] hover:bg-white/90"
          onClick={() => {
            // TODO: Implement booking flow
            console.log("Book now clicked");
          }}
        >
          Book Now
        </Button>
      </Card>
    </div>
  );
};

export default QuotePage;
