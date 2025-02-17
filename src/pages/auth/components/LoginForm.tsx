
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";

interface LoginFormProps {
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginForm = ({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={onEmailChange}
          required
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={onPasswordChange}
          required
          disabled={loading}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-[#0066B3]"
        disabled={loading}
      >
        <LogIn className="mr-2 h-4 w-4" />
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};
