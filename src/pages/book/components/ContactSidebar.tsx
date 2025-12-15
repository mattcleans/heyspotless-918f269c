import { Mail, Phone, Clock, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function ContactSidebar() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Ready for Your <span className="text-primary">Spotless</span> Home?
        </h1>
        <p className="text-lg text-muted-foreground">
          See your price and book in less than 60 seconds.
        </p>
      </div>

      {/* Contact Info */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Contact Us</h2>
        <div className="space-y-3">
          <a 
            href="mailto:hey@heyspotless.com" 
            className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="h-5 w-5" />
            <span>hey@heyspotless.com</span>
          </a>
          <a 
            href="tel:469-280-0397" 
            className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="h-5 w-5" />
            <span>469-280-0397</span>
          </a>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-accent/10 border border-accent/30 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-2">Want to Book Online?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Check prices and book your cleaning in 60 seconds.
        </p>
        <Button 
          onClick={() => navigate('/BookService')}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
        >
          Book Online Now
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-foreground text-sm">Insured & Bonded</p>
            <p className="text-xs text-muted-foreground">Your home is protected</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-foreground text-sm">Satisfaction Guaranteed</p>
            <p className="text-xs text-muted-foreground">We'll make it right</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-foreground text-sm">Flexible Scheduling</p>
            <p className="text-xs text-muted-foreground">Book at your convenience</p>
          </div>
        </div>
      </div>
    </div>
  );
}
