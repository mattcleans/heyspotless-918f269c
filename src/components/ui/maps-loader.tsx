
import { useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';

interface MapsLoaderProps {
  children: React.ReactNode;
}

export const MapsLoader = ({ children }: MapsLoaderProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return <>{children}</>;
};
