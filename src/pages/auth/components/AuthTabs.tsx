
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthTabsProps {
  email: string;
  password: string;
  userType: 'customer' | 'staff' | 'admin';
  loading: boolean;
  rememberMe: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUserTypeChange: (value: 'customer' | 'staff' | 'admin') => void;
  onRememberMeChange: (checked: boolean) => void;
  onLogin: (e: React.FormEvent) => void;
  onSignUp: (e: React.FormEvent) => void;
}

export const AuthTabs = ({
  email,
  password,
  userType,
  loading,
  rememberMe,
  onEmailChange,
  onPasswordChange,
  onUserTypeChange,
  onRememberMeChange,
  onLogin,
  onSignUp
}: AuthTabsProps) => {
  return (
    <Tabs defaultValue="login" className="space-y-6">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <LoginForm
          email={email}
          password={password}
          loading={loading}
          onEmailChange={onEmailChange}
          onPasswordChange={onPasswordChange}
          onSubmit={onLogin}
          rememberMe={rememberMe}
          onRememberMeChange={onRememberMeChange}
        />
      </TabsContent>

      <TabsContent value="register">
        <RegisterForm
          email={email}
          password={password}
          userType={userType}
          loading={loading}
          onEmailChange={onEmailChange}
          onPasswordChange={onPasswordChange}
          onUserTypeChange={onUserTypeChange}
          onSubmit={onSignUp}
        />
      </TabsContent>
    </Tabs>
  );
};
