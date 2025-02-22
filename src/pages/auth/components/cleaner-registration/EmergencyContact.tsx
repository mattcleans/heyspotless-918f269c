
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmergencyContactProps {
  emergencyContactName: string;
  emergencyContactEmail: string;
  emergencyContactPhone: string;
  loading: boolean;
  onEmergencyContactNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmergencyContactEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmergencyContactPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EmergencyContact = ({
  emergencyContactName,
  emergencyContactEmail,
  emergencyContactPhone,
  loading,
  onEmergencyContactNameChange,
  onEmergencyContactEmailChange,
  onEmergencyContactPhoneChange,
}: EmergencyContactProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Emergency Contact</h3>
      <div className="space-y-2">
        <Label htmlFor="emergencyContactName">Name*</Label>
        <Input
          id="emergencyContactName"
          type="text"
          value={emergencyContactName}
          onChange={onEmergencyContactNameChange}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="emergencyContactEmail">Email</Label>
        <Input
          id="emergencyContactEmail"
          type="email"
          value={emergencyContactEmail}
          onChange={onEmergencyContactEmailChange}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="emergencyContactPhone">Phone*</Label>
        <Input
          id="emergencyContactPhone"
          type="tel"
          value={emergencyContactPhone}
          onChange={onEmergencyContactPhoneChange}
          required
          disabled={loading}
        />
      </div>
    </div>
  );
};
