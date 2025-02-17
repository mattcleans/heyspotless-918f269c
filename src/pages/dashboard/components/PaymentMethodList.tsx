
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type PaymentMethod = Database['public']['Tables']['payment_methods']['Row'];

interface PaymentMethodListProps {
  paymentMethods?: PaymentMethod[];
}

export const PaymentMethodList = ({ paymentMethods }: PaymentMethodListProps) => {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Your saved payment options</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={() => toast({ description: "Payment method management coming soon!" })}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods?.map((method) => (
            <div key={method.id} className="flex items-center space-x-4 p-3 border rounded-lg">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{method.card_type} •••• {method.last_four}</p>
                <p className="text-sm text-muted-foreground">
                  Expires {method.expiry_month}/{method.expiry_year}
                </p>
              </div>
              {method.is_default && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Default
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
