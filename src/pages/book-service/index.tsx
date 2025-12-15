import { useRef } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { Loader2, Phone } from 'lucide-react';
import { BookServiceForm } from './components/BookServiceForm';

const libraries: ("places")[] = ["places"];

export default function BookServicePage() {
  const formRef = useRef<HTMLDivElement>(null);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/1a676461-9ff9-4ab4-b021-67ce76b13650.png" 
              alt="Hey Spotless Logo" 
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold">Hey Spotless</span>
          </div>
          <a 
            href="tel:469-280-0397" 
            className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">469-280-0397</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Book Your <span className="text-primary">Cleaning Service</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete the form below to schedule your cleaning appointment.
          </p>
        </div>

        <BookServiceForm formRef={formRef} />
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-6 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Hey Spotless. All rights reserved.</p>
          <p className="mt-1">Serving the Dallas-Fort Worth Metroplex</p>
        </div>
      </footer>
    </div>
  );
}
