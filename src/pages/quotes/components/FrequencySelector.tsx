
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CleaningFrequency {
  id: string;
  name: string;
  priceMultiplier: number;
}

interface FrequencySelectorProps {
  frequencies: CleaningFrequency[];
  selectedFrequency: string;
  onFrequencyChange: (frequency: string) => void;
}

export const FrequencySelector = ({
  frequencies,
  selectedFrequency,
  onFrequencyChange,
}: FrequencySelectorProps) => {
  const getDiscountText = (priceMultiplier: number) => {
    const discountPercentage = ((1 - priceMultiplier) * 100).toFixed(0);
    return discountPercentage !== "0" ? `${discountPercentage}% off` : "";
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-[#1B365D] mb-4">
        Service Frequency
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {frequencies.map((frequency) => (
          <div key={frequency.id} className="flex flex-col">
            <Button
              variant={selectedFrequency === frequency.id ? "default" : "outline"}
              className={selectedFrequency === frequency.id ? "bg-[#0066B3]" : ""}
              onClick={() => onFrequencyChange(frequency.id)}
            >
              {frequency.name}
            </Button>
            {getDiscountText(frequency.priceMultiplier) && (
              <span className="text-sm text-[#0066B3] mt-1 text-center font-medium">
                {getDiscountText(frequency.priceMultiplier)}
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
