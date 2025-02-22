
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AcknowledgmentsProps {
  contractorAcknowledgment: boolean;
  workEligibilityAcknowledgment: boolean;
  backgroundCheckAcknowledgment: boolean;
  loading: boolean;
  onContractorAcknowledgmentChange: (checked: boolean) => void;
  onWorkEligibilityAcknowledgmentChange: (checked: boolean) => void;
  onBackgroundCheckAcknowledgmentChange: (checked: boolean) => void;
}

export const Acknowledgments = ({
  contractorAcknowledgment,
  workEligibilityAcknowledgment,
  backgroundCheckAcknowledgment,
  loading,
  onContractorAcknowledgmentChange,
  onWorkEligibilityAcknowledgmentChange,
  onBackgroundCheckAcknowledgmentChange,
}: AcknowledgmentsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Acknowledgments</h3>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="contractorAcknowledgment"
          checked={contractorAcknowledgment}
          onCheckedChange={onContractorAcknowledgmentChange}
          disabled={loading}
        />
        <Label
          htmlFor="contractorAcknowledgment"
          className="text-sm"
        >
          I understand that as an independent contractor, I am responsible for my own transportation, equipment, supplies, and taxes.*
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="workEligibilityAcknowledgment"
          checked={workEligibilityAcknowledgment}
          onCheckedChange={onWorkEligibilityAcknowledgmentChange}
          disabled={loading}
        />
        <Label
          htmlFor="workEligibilityAcknowledgment"
          className="text-sm"
        >
          I confirm that I am legally eligible to work in the United States.*
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="backgroundCheckAcknowledgment"
          checked={backgroundCheckAcknowledgment}
          onCheckedChange={onBackgroundCheckAcknowledgmentChange}
          disabled={loading}
        />
        <Label
          htmlFor="backgroundCheckAcknowledgment"
          className="text-sm"
        >
          I authorize the company to conduct a background check as part of the hiring process.*
        </Label>
      </div>
    </div>
  );
};
