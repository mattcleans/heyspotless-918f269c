
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth";

export const useAddressForm = (onSuccess: () => void, onClose: () => void) => {
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
        zip_code: postalCode,
        user_id: userId,
        is_primary: isPrimary,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Address added successfully!",
      });
      
      onSuccess();
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

  return {
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
  };
};
