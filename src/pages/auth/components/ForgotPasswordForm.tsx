
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

interface ForgotPasswordFormProps {
  email: string;
  loading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ForgotPasswordForm = ({
  email,
  loading,
  onEmailChange,
  onSubmit
}: ForgotPasswordFormProps) => {
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
      <Button type="submit" className="w-full bg-[#0066B3]" disabled={loading}>
        <Mail className="mr-2 h-4 w-4" />
        {loading ? "Sending reset link..." : "Send Reset Link"}
      </Button>
    </form>
  );
};
