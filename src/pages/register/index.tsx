
import { AuthCard } from "../auth/components/AuthCard";
import { RegisterForm } from "../auth/components/RegisterForm";
import { useAuthentication } from "../auth/hooks/useAuthentication";
import { Link } from "react-router-dom";

const RegisterPage = () => {
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
    loading,
    showVerifyAlert,
    handleCustomerSignUp
  } = useAuthentication();

  return (
    <AuthCard showVerifyAlert={showVerifyAlert}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Join our community of happy customers and experience our premium cleaning services
          </p>
        </div>

        <RegisterForm
          email={email}
          password={password}
          firstName={firstName}
          lastName={lastName}
          phone={phone}
          loading={loading}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onFirstNameChange={(e) => setFirstName(e.target.value)}
          onLastNameChange={(e) => setLastName(e.target.value)}
          onPhoneChange={(e) => setPhone(e.target.value)}
          onSubmit={handleCustomerSignUp}
        />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </AuthCard>
  );
};

export default RegisterPage;
