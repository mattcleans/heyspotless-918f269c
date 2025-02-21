
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
          <Button
            key={frequency.id}
            variant={selectedFrequency === frequency.id ? "default" : "outline"}
            className={selectedFrequency === frequency.id ? "bg-[#0066B3]" : ""}
            onClick={() => onFrequencyChange(frequency.id)}
          >
            <div className="flex flex-col items-center">
              <span>{frequency.name}</span>
              {getDiscountText(frequency.priceMultiplier) && (
                <span className={`text-xs font-medium ${
                  selectedFrequency === frequency.id ? "text-white/80" : "text-[#0066B3]"
                }`}>
                  {getDiscountText(frequency.priceMultiplier)}
                </span>
              )}
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};
