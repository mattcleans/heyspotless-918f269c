
import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/App";
import { Loader2 } from "lucide-react";
import { Autocomplete } from "@react-google-maps/api";
import { MapsLoader } from "@/components/ui/maps-loader";

interface AddAddressDialogProps {
  open: boolean;
  onClose: () => void;
  onAddressAdded: () => void;
}

export function AddAddressDialog({ open, onClose, onAddressAdded }: AddAddressDialogProps) {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const { toast } = useToast();
  const userId = useAuthStore((state) => state.userId);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    console.log("Autocomplete loaded");
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = useCallback(() => {
    if (autocomplete) {
      console.log("Place changed");
      const place = autocomplete.getPlace();
      if (place.address_components) {
        let streetNumber = "";
        let streetName = "";
        let cityComponent = "";
        let stateComponent = "";
        let postalCodeComponent = "";

        place.address_components.forEach((component) => {
          const types = component.types;
          if (types.includes("street_number")) {
            streetNumber = component.long_name;
          } else if (types.includes("route")) {
            streetName = component.long_name;
          } else if (types.includes("locality")) {
            cityComponent = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            stateComponent = component.short_name;
          } else if (types.includes("postal_code")) {
            postalCodeComponent = component.long_name;
          }
        });

        setStreet(`${streetNumber} ${streetName}`.trim());
        setCity(cityComponent);
        setState(stateComponent);
        setPostalCode(postalCodeComponent);
      }
    }
  }, [autocomplete]);

  const resetForm = () => {
    setStreet("");
    setCity("");
    setState("");
    setPostalCode("");
    setIsPrimary(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !street || !city || !state || !postalCode) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // If this is set as primary, update all other addresses to non-primary
      if (isPrimary) {
        await supabase
          .from('addresses')
          .update({ is_primary: false })
          .eq('user_id', userId);
      }

      const { error } = await supabase.from('addresses').insert({
        street,
        city,
        state,
        postal_code: postalCode,
        user_id: userId,
        is_primary: isPrimary,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Address added successfully!",
      });
      
      onAddressAdded();
      resetForm();
      onClose();
    } catch (error: any) {
      console.error('Error adding address:', error);
      toast({
        title: "Error",
        description: "Failed to add address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
        </DialogHeader>
        <MapsLoader>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  onChange={(e) => setStreet(e.target.value)}
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
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
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
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="ZIP Code"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPrimary"
                checked={isPrimary}
                onCheckedChange={(checked) => setIsPrimary(checked as boolean)}
              />
              <Label htmlFor="isPrimary">Set as primary address</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving || !street || !city || !state || !postalCode}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Address
              </Button>
            </div>
          </form>
        </MapsLoader>
      </DialogContent>
    </Dialog>
  );
}
