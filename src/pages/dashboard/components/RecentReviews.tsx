
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Review = Database['public']['Tables']['reviews']['Row'];

interface RecentReviewsProps {
  reviews?: Review[];
}

export const RecentReviews = ({ reviews }: RecentReviewsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reviews</CardTitle>
        <CardDescription>What your clients are saying</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews?.map((review) => (
            <div key={review.id} className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(review.created_at), 'MMM d, yyyy')}
                </span>
              </div>
              <p className="text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
