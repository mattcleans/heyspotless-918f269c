import { useMemo } from 'react';
import { DollarSign } from 'lucide-react';

interface PriceEstimateProps {
  serviceType: string;
  frequency: string;
  propertySize: string;
}

const BASE_PRICES: Record<string, number> = {
  'standard': 150,
  'deep': 250,
  'move': 350,
};

const SIZE_MULTIPLIERS: Record<string, number> = {
  '0-1500': 1.0,
  '1501-2500': 1.3,
  '2501-3500': 1.6,
  '3501+': 2.0,
};

const FREQUENCY_DISCOUNTS: Record<string, number> = {
  'weekly': 0.80,
  'biweekly': 0.90,
  'monthly': 0.95,
  'one-time': 1.0,
};

export function PriceEstimate({ serviceType, frequency, propertySize }: PriceEstimateProps) {
  const estimate = useMemo(() => {
    const base = BASE_PRICES[serviceType] || 150;
    const sizeMultiplier = SIZE_MULTIPLIERS[propertySize] || 1.0;
    const frequencyDiscount = FREQUENCY_DISCOUNTS[frequency] || 1.0;
    
    return Math.round(base * sizeMultiplier * frequencyDiscount);
  }, [serviceType, frequency, propertySize]);

  const savings = useMemo(() => {
    if (frequency === 'one-time') return 0;
    const base = BASE_PRICES[serviceType] || 150;
    const sizeMultiplier = SIZE_MULTIPLIERS[propertySize] || 1.0;
    const fullPrice = Math.round(base * sizeMultiplier);
    return fullPrice - estimate;
  }, [serviceType, frequency, propertySize, estimate]);

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Estimated Price</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-primary">${estimate}</span>
        <span className="text-muted-foreground">/ visit</span>
      </div>
      {savings > 0 && (
        <p className="text-sm text-green-600 mt-2">
          You save ${savings} with {frequency} cleaning!
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-3">
        *Final price may vary based on home condition and specific requirements
      </p>
    </div>
  );
}
