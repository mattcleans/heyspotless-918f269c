
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Earning = Database['public']['Tables']['earnings']['Row'];

interface RecentEarningsProps {
  earnings?: Earning[];
}

export const RecentEarnings = ({ earnings }: RecentEarningsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Earnings</CardTitle>
        <CardDescription>Your latest payments and tips</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {earnings?.map((earning) => (
            <div key={earning.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">${(Number(earning.amount) + Number(earning.tip_amount)).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(earning.created_at), 'MMM d, yyyy')}
                  {earning.tip_amount > 0 && ` (includes $${Number(earning.tip_amount).toFixed(2)} tip)`}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
