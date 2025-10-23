
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";

interface RoomCounts {
  [key: string]: number;
}

interface ServiceType {
  id: string;
  type: string;
  name: string;
  price_multiplier: number;
  description: string;
  created_at?: string;
  updated_at?: string;
}

interface RoomSelectorProps {
  rooms: { [key: string]: number };
  roomCounts: RoomCounts;
  onUpdateRoomCount: (room: string, increment: boolean) => void;
  selectedServiceType: ServiceType | null;
}

export const RoomSelector = ({
  rooms,
  roomCounts,
  onUpdateRoomCount,
  selectedServiceType,
}: RoomSelectorProps) => {
  const getAdjustedPrice = (basePrice: number) => {
    const multiplier = selectedServiceType?.price_multiplier || 1;
    return basePrice * multiplier;
  };

  return (
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
                ${getAdjustedPrice(price).toFixed(2)} per room
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateRoomCount(room, false)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{roomCounts[room] || 0}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateRoomCount(room, true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
