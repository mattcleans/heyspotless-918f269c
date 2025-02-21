
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface GuestInfo {
  email: string;
  phone: string;
}

interface GuestInformationProps {
  guestInfo: GuestInfo;
  onGuestInfoChange: (info: GuestInfo) => void;
  onNext: () => void;
}

const GuestInformation = ({ guestInfo, onGuestInfoChange, onNext }: GuestInformationProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-[#0066B3] text-center">Contact Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            required
            value={guestInfo.email}
            onChange={(e) => onGuestInfoChange({ ...guestInfo, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone
          </label>
          <Input
            id="phone"
            type="tel"
            required
            value={guestInfo.phone}
            onChange={(e) => onGuestInfoChange({ ...guestInfo, phone: e.target.value })}
            placeholder="Enter your phone number"
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Next <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
};

export default GuestInformation;
