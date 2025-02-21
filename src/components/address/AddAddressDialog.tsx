
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { MapsLoader } from "@/components/ui/maps-loader";
import { AddressFormFields } from "./components/AddressFormFields";
import { useAddressForm } from "./hooks/useAddressForm";

interface AddAddressDialogProps {
  open: boolean;
  onClose: () => void;
  onAddressAdded: () => void;
}

export function AddAddressDialog({ open, onClose, onAddressAdded }: AddAddressDialogProps) {
  const {
    street,
    setStreet,
    city,
    setCity,
    state,
    setState,
    postalCode,
    setPostalCode,
    isPrimary,
    setIsPrimary,
    saving,
    onLoad,
    onPlaceChanged,
    handleSubmit
  } = useAddressForm(onAddressAdded, onClose);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
        </DialogHeader>
        <MapsLoader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AddressFormFields
              street={street}
              city={city}
              state={state}
              postalCode={postalCode}
              isPrimary={isPrimary}
              onStreetChange={setStreet}
              onCityChange={setCity}
              onStateChange={setState}
              onPostalCodeChange={setPostalCode}
              onIsPrimaryChange={setIsPrimary}
              onLoad={onLoad}
              onPlaceChanged={onPlaceChanged}
            />
            
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
