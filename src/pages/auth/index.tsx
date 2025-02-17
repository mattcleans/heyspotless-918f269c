
import { AuthCard } from "./components/AuthCard";
import { AuthTabs } from "./components/AuthTabs";
import { useAuthentication } from "./hooks/useAuthentication";

const AuthPage = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    userType,
    setUserType,
    loading,
    showVerifyAlert,
    rememberMe,
    setRememberMe,
    handleLogin,
    handleSignUp
  } = useAuthentication();

  return (
    <AuthCard showVerifyAlert={showVerifyAlert}>
      <AuthTabs
        email={email}
        password={password}
        userType={userType}
        loading={loading}
        rememberMe={rememberMe}
        onEmailChange={(e) => setEmail(e.target.value)}
        onPasswordChange={(e) => setPassword(e.target.value)}
        onUserTypeChange={setUserType}
        onRememberMeChange={setRememberMe}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      />
    </AuthCard>
  );
};

export default AuthPage;
