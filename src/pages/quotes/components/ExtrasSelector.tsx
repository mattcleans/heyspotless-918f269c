
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface ExtraService {
  name: string;
  price: number;
}

interface ExtrasSelectorProps {
  extraServices: ExtraService[];
  selectedExtras: string[];
  onToggleExtra: (serviceName: string) => void;
}

export const ExtrasSelector = ({
  extraServices,
  selectedExtras,
  onToggleExtra,
}: ExtrasSelectorProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-[#1B365D] mb-4">
        Extra Services
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {extraServices.map((service) => (
          <div
            key={service.name}
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
              selectedExtras.includes(service.name)
                ? "border-[#0066B3] bg-[#0066B3]/5"
                : ""
            }`}
            onClick={() => onToggleExtra(service.name)}
          >
            <div>
              <p className="font-medium text-[#1B365D]">{service.name}</p>
              <p className="text-sm text-[#1B365D]/60">
                ${service.price.toFixed(2)}
              </p>
            </div>
            {selectedExtras.includes(service.name) && (
              <Check className="h-5 w-5 text-[#0066B3]" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
