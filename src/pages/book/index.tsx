import { useRef } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { ContactSidebar } from './components/ContactSidebar';
import { BookingForm } from './components/BookingForm';
import { Loader2 } from 'lucide-react';

const libraries: ('places')[] = ['places'];

export default function BookPage() {
  const formRef = useRef<HTMLDivElement>(null);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-secondary/10">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
            className="text-sm hover:underline"
          >
            Call: 469-280-0397
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Sidebar */}
          <div className="lg:col-span-2">
            <ContactSidebar />
          </div>

          {/* Right Form */}
          <div className="lg:col-span-3">
            <BookingForm formRef={formRef} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-6 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Hey Spotless. All rights reserved.</p>
          <p className="mt-1">Serving the Dallas-Fort Worth Metroplex</p>
        </div>
      </footer>
    </div>
  );
}
