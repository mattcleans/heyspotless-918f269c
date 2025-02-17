
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface QuoteSummaryProps {
  total: number;
  frequencyName: string;
  serviceTypeName: string;
  onBookNow: () => void;
}

export const QuoteSummary = ({ total, frequencyName, serviceTypeName, onBookNow }: QuoteSummaryProps) => {
  return (
    <Card className="p-6 bg-[#0066B3] text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Total Estimate</h2>
          <p className="text-white/80">{serviceTypeName} - {frequencyName}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">${total.toFixed(2)}</p>
          <p className="text-white/80">per service</p>
        </div>
      </div>
      <Button
        className="w-full mt-4 bg-white text-[#0066B3] hover:bg-white/90"
        onClick={onBookNow}
      >
        Book Now
      </Button>
    </Card>
  );
};
