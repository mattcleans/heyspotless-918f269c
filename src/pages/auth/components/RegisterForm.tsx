
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface RegisterFormProps {
  email: string;
  password: string;
  userType: 'customer' | 'staff' | 'admin';
  loading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUserTypeChange: (value: 'customer' | 'staff' | 'admin') => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RegisterForm = ({
  email,
  password,
  userType,
  loading,
  onEmailChange,
  onPasswordChange,
  onUserTypeChange,
  onSubmit,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleUserTypeChange = (value: string) => {
    // Ensure we only pass allowed values to the parent
    if (value === 'customer' || value === 'staff') {
      onUserTypeChange(value);
    }
  };

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
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="space-y-2">
        <Label>I am a:</Label>
        <RadioGroup 
          value={userType} 
          onValueChange={handleUserTypeChange}
          className="flex flex-wrap gap-4"
          disabled={loading}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="customer" id="customer" />
            <Label htmlFor="customer">Customer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="staff" id="staff" />
            <Label htmlFor="staff">Staff Member</Label>
          </div>
        </RadioGroup>
      </div>
      <Button 
        type="submit" 
        className="w-full"
        variant="outline"
        disabled={loading}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
};
