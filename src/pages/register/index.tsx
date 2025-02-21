
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
    userType,
    setUserType,
    loading,
    showVerifyAlert,
    handleSignUp
  } = useAuthentication();

  return (
    <AuthCard showVerifyAlert={showVerifyAlert}>
      <div className="space-y-6">
        <RegisterForm
          email={email}
          password={password}
          userType={userType}
          loading={loading}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onUserTypeChange={setUserType}
          onSubmit={handleSignUp}
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
