
import { Steps } from "@/components/ui/steps";

export type BookingStep = "date" | "time" | "quote" | "address" | "payment" | "confirmation";

interface BookingHeaderProps {
  currentStep: BookingStep;
}

const BookingHeader = ({ currentStep }: BookingHeaderProps) => {
  const steps = [
    { label: "Date", value: "date" },
    { label: "Time", value: "time" },
    { label: "Quote", value: "quote" },
    { label: "Address", value: "address" },
    { label: "Payment", value: "payment" },
    { label: "Confirmation", value: "confirmation" },
  ];

  const currentStepIndex = steps.findIndex((step) => step.value === currentStep);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Steps
        steps={steps}
        currentStep={currentStepIndex}
      />
    </div>
  );
};

export default BookingHeader;
