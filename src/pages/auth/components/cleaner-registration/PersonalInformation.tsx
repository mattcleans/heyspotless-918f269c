
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PersonalInformationProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  ssn: string;
  loading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSsnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PersonalInformation = ({
  email,
  password,
  firstName,
  lastName,
  phone,
  ssn,
  loading,
  onEmailChange,
  onPasswordChange,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
  onSsnChange,
}: PersonalInformationProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Personal Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name*</Label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={onFirstNameChange}
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name*</Label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={onLastNameChange}
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email*</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={onEmailChange}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password*</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={onPasswordChange}
            required
            disabled={loading}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-0"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number*</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={onPhoneChange}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ssn">Social Security Number*</Label>
        <Input
          id="ssn"
          type="text"
          value={ssn}
          onChange={onSsnChange}
          required
          disabled={loading}
          pattern="\d{3}-?\d{2}-?\d{4}"
          placeholder="XXX-XX-XXXX"
        />
      </div>
    </div>
  );
};
