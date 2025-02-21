
import { Check } from "lucide-react";

export type BookingStep = "date" | "time" | "quote" | "guest-info" | "address" | "payment" | "confirmation";

const steps: { key: BookingStep; label: string }[] = [
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  { key: "quote", label: "Quote" },
  { key: "guest-info", label: "Contact" },
  { key: "address", label: "Address" },
  { key: "confirmation", label: "Confirmed" }
];

interface BookingHeaderProps {
  currentStep: BookingStep;
}

const BookingHeader = ({ currentStep }: BookingHeaderProps) => {
  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-center space-x-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = step.key === currentStep;

          // Only show guest-info step for anonymous users
          if (step.key === "guest-info") {
            return null;
          }

          return (
            <li key={step.key} className="flex items-center">
              <div
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full border-2
                  ${isCompleted ? 'border-[#0066B3] bg-[#0066B3] text-white' : ''}
                  ${isCurrent ? 'border-[#0066B3] text-[#0066B3]' : ''}
                  ${!isCompleted && !isCurrent ? 'border-gray-300 text-gray-300' : ''}
                `}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    h-0.5 w-12
                    ${index < currentStepIndex ? 'bg-[#0066B3]' : 'bg-gray-300'}
                  `}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BookingHeader;
