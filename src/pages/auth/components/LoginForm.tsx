
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { LogIn } from "lucide-react";

interface LoginFormProps {
  email: string;
  loading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  rememberMe: boolean;
  onRememberMeChange: (checked: boolean) => void;
  onForgotPasswordClick: () => void;
}

export const LoginForm = ({
  email,
  loading,
  onEmailChange,
  onSubmit,
  rememberMe,
  onRememberMeChange,
}: LoginFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input 
          type="email" 
          placeholder="name@example.com" 
          value={email} 
          onChange={onEmailChange} 
          required 
          disabled={loading}
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          className="w-full"
          autoComplete="email"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="remember"
          checked={rememberMe}
          onCheckedChange={onRememberMeChange}
        />
        <label
          htmlFor="remember"
          className="text-sm text-muted-foreground cursor-pointer"
        >
          Keep me signed in
        </label>
      </div>
      <Button type="submit" className="w-full bg-[#0066B3]" disabled={loading}>
        <LogIn className="mr-2 h-4 w-4" />
        {loading ? "Sending magic link..." : "Sign in with Email"}
      </Button>
    </form>
  );
};
