
import { AuthCard } from "./components/AuthCard";
import { LoginForm } from "./components/LoginForm";
import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import { useAuthentication } from "./hooks/useAuthentication";
import { Link } from "react-router-dom";

const AuthPage = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    showVerifyAlert,
    rememberMe,
    setRememberMe,
    isResetMode,
    setIsResetMode,
    handleLogin,
    handleForgotPassword,
  } = useAuthentication();

  return (
    <AuthCard showVerifyAlert={showVerifyAlert}>
      <div className="space-y-6">
        {isResetMode ? (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
            <ForgotPasswordForm
              email={email}
              loading={loading}
              onEmailChange={(e) => setEmail(e.target.value)}
              onSubmit={handleForgotPassword}
            />
            <div className="text-center">
              <button
                onClick={() => setIsResetMode(false)}
                className="text-sm text-primary hover:underline"
              >
                Back to login
              </button>
            </div>
          </>
        ) : (
          <>
            <LoginForm
              email={email}
              password={password}
              loading={loading}
              onEmailChange={(e) => setEmail(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onSubmit={handleLogin}
              rememberMe={rememberMe}
              onRememberMeChange={setRememberMe}
              onForgotPasswordClick={() => setIsResetMode(true)}
            />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </AuthCard>
  );
};

export default AuthPage;
