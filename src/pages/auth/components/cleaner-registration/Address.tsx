
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressProps {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  loading: boolean;
  onStreetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onZipCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Address = ({
  street,
  city,
  state,
  zipCode,
  loading,
  onStreetChange,
  onCityChange,
  onStateChange,
  onZipCodeChange,
}: AddressProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Address</h3>
      <div className="space-y-2">
        <Label htmlFor="street">Street Address*</Label>
        <Input
          id="street"
          type="text"
          value={street}
          onChange={onStreetChange}
          required
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City*</Label>
          <Input
            id="city"
            type="text"
            value={city}
            onChange={onCityChange}
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State*</Label>
          <Input
            id="state"
            type="text"
            value={state}
            onChange={onStateChange}
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zipCode">ZIP Code*</Label>
        <Input
          id="zipCode"
          type="text"
          value={zipCode}
          onChange={onZipCodeChange}
          required
          disabled={loading}
          pattern="\d{5}(-\d{4})?"
        />
      </div>
    </div>
  );
};
