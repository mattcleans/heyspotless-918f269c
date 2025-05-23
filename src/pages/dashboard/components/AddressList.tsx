
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import { AddAddressDialog } from "@/components/address/AddAddressDialog";
import type { Database } from "@/integrations/supabase/types";

type Address = Database['public']['Tables']['addresses']['Row'];

interface AddressListProps {
  addresses?: Address[];
}

export const AddressList = ({ addresses }: AddressListProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddressAdded = () => {
    // This will trigger a refresh of the addresses list in the parent component
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Saved Addresses</CardTitle>
          <CardDescription>Your saved cleaning locations</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {addresses?.map((address) => (
            <div key={address.id} className="flex items-center space-x-4 p-3 border rounded-lg">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{address.street}</p>
                <p className="text-sm text-muted-foreground">
                  {address.city}, {address.state} {address.postal_code}
                </p>
              </div>
              {address.is_primary && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>

      <AddAddressDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddressAdded={handleAddressAdded}
      />
    </Card>
  );
};
