
import { AuthCard } from "./components/AuthCard";
import { LoginForm } from "./components/LoginForm";
import { useAuthentication } from "./hooks/useAuthentication";
import { Link } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

const AuthPage = () => {
  const {
    email,
    setEmail,
    loading,
    showVerifyAlert,
    rememberMe,
    setRememberMe,
    handleLogin,
  } = useAuthentication();

  return (
    <>
      <AuthCard showVerifyAlert={showVerifyAlert}>
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Sign In</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to receive a magic link
            </p>
          </div>
          <LoginForm
            email={email}
            loading={loading}
            onEmailChange={(e) => setEmail(e.target.value)}
            onSubmit={handleLogin}
            rememberMe={rememberMe}
            onRememberMeChange={setRememberMe}
            onForgotPasswordClick={() => {}}
          />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </AuthCard>
      <Toaster />
    </>
  );
};

export default AuthPage;

