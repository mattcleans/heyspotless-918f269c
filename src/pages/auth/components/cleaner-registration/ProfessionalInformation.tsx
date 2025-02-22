
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfessionalInformationProps {
  yearsExperience: string;
  loading: boolean;
  onYearsExperienceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfessionalInformation = ({
  yearsExperience,
  loading,
  onYearsExperienceChange,
}: ProfessionalInformationProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Professional Information</h3>
      <div className="space-y-2">
        <Label htmlFor="yearsExperience">Years of Experience</Label>
        <Input
          id="yearsExperience"
          type="number"
          min="0"
          value={yearsExperience}
          onChange={onYearsExperienceChange}
          disabled={loading}
        />
      </div>
    </div>
  );
};
