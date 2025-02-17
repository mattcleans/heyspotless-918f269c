
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface LoginFormProps {
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  rememberMe: boolean;
  onRememberMeChange: (checked: boolean) => void;
}

export const LoginForm = ({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  rememberMe,
  onRememberMeChange
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
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
      <div className="relative">
        <Input 
          type={showPassword ? "text" : "password"} 
          placeholder="Password" 
          value={password} 
          onChange={onPasswordChange} 
          required 
          disabled={loading} 
          className="pr-10"
        />
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-0"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
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
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};
