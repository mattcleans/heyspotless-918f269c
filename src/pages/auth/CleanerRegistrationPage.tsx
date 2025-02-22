
import { AuthCard } from "./components/AuthCard";
import { CleanerRegistrationForm } from "./components/CleanerRegistrationForm";
import { useCleanerSignup } from "./hooks/useCleanerSignup";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/App";

const CleanerRegistrationPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const {
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    ssn,
    setSsn,
    yearsExperience,
    setYearsExperience,
    street,
    setStreet,
    city,
    setCity,
    state,
    setState,
    zipCode,
    setZipCode,
    emergencyContactName,
    setEmergencyContactName,
    emergencyContactEmail,
    setEmergencyContactEmail,
    emergencyContactPhone,
    setEmergencyContactPhone,
    contractorAcknowledgment,
    setContractorAcknowledgment,
    workEligibilityAcknowledgment,
    setWorkEligibilityAcknowledgment,
    backgroundCheckAcknowledgment,
    setBackgroundCheckAcknowledgment,
    loading,
    showVerifyAlert,
    handleCleanerSignUp
  } = useCleanerSignup();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthCard showVerifyAlert={showVerifyAlert}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Cleaner Registration</h1>
          <p className="text-sm text-muted-foreground">
            Join our cleaning staff and start earning today
          </p>
        </div>

        <CleanerRegistrationForm
          email={email}
          password={password}
          firstName={firstName}
          lastName={lastName}
          phone={phone}
          ssn={ssn}
          yearsExperience={yearsExperience}
          street={street}
          city={city}
          state={state}
          zipCode={zipCode}
          emergencyContactName={emergencyContactName}
          emergencyContactEmail={emergencyContactEmail}
          emergencyContactPhone={emergencyContactPhone}
          contractorAcknowledgment={contractorAcknowledgment}
          workEligibilityAcknowledgment={workEligibilityAcknowledgment}
          backgroundCheckAcknowledgment={backgroundCheckAcknowledgment}
          loading={loading}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onFirstNameChange={(e) => setFirstName(e.target.value)}
          onLastNameChange={(e) => setLastName(e.target.value)}
          onPhoneChange={(e) => setPhone(e.target.value)}
          onSsnChange={(e) => setSsn(e.target.value)}
          onYearsExperienceChange={(e) => setYearsExperience(e.target.value)}
          onStreetChange={(e) => setStreet(e.target.value)}
          onCityChange={(e) => setCity(e.target.value)}
          onStateChange={(e) => setState(e.target.value)}
          onZipCodeChange={(e) => setZipCode(e.target.value)}
          onEmergencyContactNameChange={(e) => setEmergencyContactName(e.target.value)}
          onEmergencyContactEmailChange={(e) => setEmergencyContactEmail(e.target.value)}
          onEmergencyContactPhoneChange={(e) => setEmergencyContactPhone(e.target.value)}
          onContractorAcknowledgmentChange={setContractorAcknowledgment}
          onWorkEligibilityAcknowledgmentChange={setWorkEligibilityAcknowledgment}
          onBackgroundCheckAcknowledgmentChange={setBackgroundCheckAcknowledgment}
          onSubmit={handleCleanerSignUp}
        />
      </div>
    </AuthCard>
  );
};

export default CleanerRegistrationPage;
