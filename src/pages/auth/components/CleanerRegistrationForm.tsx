
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface CleanerRegistrationFormProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  ssn: string;
  yearsExperience: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactEmail: string;
  emergencyContactPhone: string;
  contractorAcknowledgment: boolean;
  workEligibilityAcknowledgment: boolean;
  backgroundCheckAcknowledgment: boolean;
  loading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSsnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onYearsExperienceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStreetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onZipCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmergencyContactNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmergencyContactEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmergencyContactPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContractorAcknowledgmentChange: (checked: boolean) => void;
  onWorkEligibilityAcknowledgmentChange: (checked: boolean) => void;
  onBackgroundCheckAcknowledgmentChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CleanerRegistrationForm = ({
  email,
  password,
  firstName,
  lastName,
  phone,
  ssn,
  yearsExperience,
  street,
  city,
  state,
  zipCode,
  emergencyContactName,
  emergencyContactEmail,
  emergencyContactPhone,
  contractorAcknowledgment,
  workEligibilityAcknowledgment,
  backgroundCheckAcknowledgment,
  loading,
  onEmailChange,
  onPasswordChange,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
  onSsnChange,
  onYearsExperienceChange,
  onStreetChange,
  onCityChange,
  onStateChange,
  onZipCodeChange,
  onEmergencyContactNameChange,
  onEmergencyContactEmailChange,
  onEmergencyContactPhoneChange,
  onContractorAcknowledgmentChange,
  onWorkEligibilityAcknowledgmentChange,
  onBackgroundCheckAcknowledgmentChange,
  onSubmit,
}: CleanerRegistrationFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Address</h3>
        <div className="space-y-2">
          <Label htmlFor="street">Street Address*</Label>
          <Input
            id="street"
            type="text"
            value={street}
            onChange={onStreetChange}
            required
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City*</Label>
            <Input
              id="city"
              type="text"
              value={city}
              onChange={onCityChange}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State*</Label>
            <Input
              id="state"
              type="text"
              value={state}
              onChange={onStateChange}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code*</Label>
          <Input
            id="zipCode"
            type="text"
            value={zipCode}
            onChange={onZipCodeChange}
            required
            disabled={loading}
            pattern="\d{5}(-\d{4})?"
          />
        </div>
      </div>

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

      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        {loading ? "Creating your account..." : "Create Cleaner Account"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        * Required fields
      </p>
    </form>
  );
};
