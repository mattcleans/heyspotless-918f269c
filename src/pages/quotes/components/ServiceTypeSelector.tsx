
import { Card } from "@/components/ui/card";

interface ServiceType {
  id: string;
  type: 'standard' | 'deep' | 'move';
  name: string;
  price_multiplier: number;
  description: string;
}

interface ServiceTypeSelectorProps {
  serviceTypes: ServiceType[];
  selectedServiceType: ServiceType | null;
  onServiceTypeChange: (serviceType: ServiceType) => void;
}

export const ServiceTypeSelector = ({
  serviceTypes,
  selectedServiceType,
  onServiceTypeChange,
}: ServiceTypeSelectorProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-[#1B365D] mb-4">
        Select Service Type
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {serviceTypes.map((serviceType) => (
          <div
            key={serviceType.id}
            onClick={() => onServiceTypeChange(serviceType)}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedServiceType?.id === serviceType.id
                ? "border-[#0066B3] bg-[#0066B3]/5"
                : "hover:border-[#0066B3]/50"
            }`}
          >
            <h3 className="font-medium text-[#1B365D]">{serviceType.name}</h3>
            <p className="text-sm text-[#1B365D]/60 mt-1">
              {serviceType.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
