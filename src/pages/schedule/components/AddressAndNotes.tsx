
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Autocomplete } from "@react-google-maps/api";

interface AddressAndNotesProps {
  address: string;
  notes: string;
  onAddressChange: (address: string) => void;
  onNotesChange: (notes: string) => void;
  onBook: () => void;
  onLoad: (autocomplete: google.maps.places.Autocomplete) => void;
  onPlaceChanged: () => void;
}

const AddressAndNotes = ({
  address,
  notes,
  onAddressChange,
  onNotesChange,
  onBook,
  onLoad,
  onPlaceChanged,
}: AddressAndNotesProps) => {
  return (
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
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="Enter your address"
              className="w-full"
            />
          </Autocomplete>
        </div>
        <div>
          <h3 className="text-lg font-medium text-[#0066B3] mb-2">ANY NOTES FOR US?</h3>
          <Textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Special instructions or requests..."
            className="w-full h-32"
          />
        </div>
      </div>
      <Button
        onClick={onBook}
        disabled={!address}
        className="w-full bg-[#0066B3] hover:bg-[#0066B3]/90"
      >
        BOOK
      </Button>
    </div>
  );
};

export default AddressAndNotes;
