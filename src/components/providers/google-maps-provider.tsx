"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | null;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: null,
});

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }
  return context;
};

interface GoogleMapsProviderProps {
  children: React.ReactNode;
  apiKey: string;
}

export function GoogleMapsProvider({ children, apiKey }: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Load Google Maps API with Places library
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setLoadError(new Error("Failed to load Google Maps API"));
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [apiKey]);

  const contextValue: GoogleMapsContextType = {
    isLoaded,
    loadError,
  };

  return (
    <GoogleMapsContext.Provider value={contextValue}>
      <APIProvider apiKey={apiKey} libraries={["places"]}>
        {children}
      </APIProvider>
    </GoogleMapsContext.Provider>
  );
}

// Hook to check if Google Maps API is loaded
export const useGoogleMapsLoaded = () => {
  const { isLoaded, loadError } = useGoogleMaps();
  return { isLoaded, loadError };
};
