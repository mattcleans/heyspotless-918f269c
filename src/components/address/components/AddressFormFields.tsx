
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Autocomplete } from "@react-google-maps/api";

interface AddressFormFieldsProps {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isPrimary: boolean;
  onStreetChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onPostalCodeChange: (value: string) => void;
  onIsPrimaryChange: (checked: boolean) => void;
  onLoad: (autocomplete: google.maps.places.Autocomplete) => void;
  onPlaceChanged: () => void;
}

export function AddressFormFields({
  street,
  city,
  state,
  postalCode,
  isPrimary,
  onStreetChange,
  onCityChange,
  onStateChange,
  onPostalCodeChange,
  onIsPrimaryChange,
  onLoad,
  onPlaceChanged,
}: AddressFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="street">Street Address</Label>
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          restrictions={{ country: "us" }}
        >
          <Input
            id="street"
            value={street}
            onChange={(e) => onStreetChange(e.target.value)}
            placeholder="Enter your street address"
            required
          />
        </Autocomplete>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="City"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
            placeholder="State"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="postalCode">ZIP Code</Label>
        <Input
          id="postalCode"
          value={postalCode}
          onChange={(e) => onPostalCodeChange(e.target.value)}
          placeholder="ZIP Code"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isPrimary"
          checked={isPrimary}
          onCheckedChange={(checked) => onIsPrimaryChange(checked as boolean)}
        />
        <Label htmlFor="isPrimary">Set as primary address</Label>
      </div>
    </>
  );
}
