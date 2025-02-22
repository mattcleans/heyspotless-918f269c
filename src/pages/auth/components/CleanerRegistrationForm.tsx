
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { PersonalInformation } from "./cleaner-registration/PersonalInformation";
import { ProfessionalInformation } from "./cleaner-registration/ProfessionalInformation";
import { Address } from "./cleaner-registration/Address";
import { EmergencyContact } from "./cleaner-registration/EmergencyContact";
import { Acknowledgments } from "./cleaner-registration/Acknowledgments";

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
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <PersonalInformation
        email={email}
        password={password}
        firstName={firstName}
        lastName={lastName}
        phone={phone}
        ssn={ssn}
        loading={loading}
        onEmailChange={onEmailChange}
        onPasswordChange={onPasswordChange}
        onFirstNameChange={onFirstNameChange}
        onLastNameChange={onLastNameChange}
        onPhoneChange={onPhoneChange}
        onSsnChange={onSsnChange}
      />

      <ProfessionalInformation
        yearsExperience={yearsExperience}
        loading={loading}
        onYearsExperienceChange={onYearsExperienceChange}
      />

      <Address
        street={street}
        city={city}
        state={state}
        zipCode={zipCode}
        loading={loading}
        onStreetChange={onStreetChange}
        onCityChange={onCityChange}
        onStateChange={onStateChange}
        onZipCodeChange={onZipCodeChange}
      />

      <EmergencyContact
        emergencyContactName={emergencyContactName}
        emergencyContactEmail={emergencyContactEmail}
        emergencyContactPhone={emergencyContactPhone}
        loading={loading}
        onEmergencyContactNameChange={onEmergencyContactNameChange}
        onEmergencyContactEmailChange={onEmergencyContactEmailChange}
        onEmergencyContactPhoneChange={onEmergencyContactPhoneChange}
      />

      <Acknowledgments
        contractorAcknowledgment={contractorAcknowledgment}
        workEligibilityAcknowledgment={workEligibilityAcknowledgment}
        backgroundCheckAcknowledgment={backgroundCheckAcknowledgment}
        loading={loading}
        onContractorAcknowledgmentChange={onContractorAcknowledgmentChange}
        onWorkEligibilityAcknowledgmentChange={onWorkEligibilityAcknowledgmentChange}
        onBackgroundCheckAcknowledgmentChange={onBackgroundCheckAcknowledgmentChange}
      />

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
