"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface PlaceResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  vicinity?: string;
  business_status?: string;
  rating?: number;
  user_ratings_total?: number;
  formatted_phone_number?: string;
  website?: string;
}

interface PlacesAutocompleteProps {
  value?: string;
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function PlacesAutocomplete({
  value = "",
  onPlaceSelect,
  placeholder = "Search for a place...",
  className,
  disabled = false,
}: PlacesAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<PlaceResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  
  // Convex queries and mutations
  const searchStoredPlaces = useQuery(api.places.searchPlaces, {
    searchTerm: inputValue,
    limit: 5,
  });
  const upsertPlace = useMutation(api.places.upsertPlace);

  // Initialize Google Places services
  useEffect(() => {
    if (typeof window !== "undefined" && window.google?.maps?.places) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      
      // Create a dummy div for PlacesService (required by Google Maps API)
      const dummyDiv = document.createElement("div");
      placesService.current = new google.maps.places.PlacesService(dummyDiv);
    }
  }, []);

  // Debounced search function
  const searchPlaces = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setPredictions([]);
        return;
      }

      setIsLoading(true);

      try {
        // First, show stored places from our database
        const storedPlaces = searchStoredPlaces || [];

        // Convert stored places to PlaceResult format
        const storedPlaceResults: PlaceResult[] = storedPlaces.map(place => ({
          place_id: place.placeId,
          description: place.formattedAddress,
          structured_formatting: {
            main_text: place.name,
            secondary_text: place.address,
          },
          types: place.types,
        }));

        // If Google Places API is not available, just show stored places
        if (!autocompleteService.current) {
          setPredictions(storedPlaceResults);
          setIsLoading(false);
          return;
        }

        // Then fetch from Google Places API
        autocompleteService.current.getPlacePredictions(
          {
            input: query,
            types: ["establishment", "geocode"],
          },
          (predictions, status) => {
            setIsLoading(false);

            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              // Combine stored places with Google predictions
              const combinedResults: PlaceResult[] = [
                ...storedPlaceResults,
                ...predictions,
              ];

              // Remove duplicates based on place_id
              const uniqueResults = combinedResults.filter(
                (result, index, self) =>
                  index === self.findIndex(r => r?.place_id === result?.place_id)
              );

              setPredictions(uniqueResults.slice(0, 10)); // Limit to 10 results
            } else {
              // If Google API fails, just show stored places
              setPredictions(storedPlaceResults);
            }
          }
        );
      } catch (error) {
        console.error("Error searching places:", error);
        setIsLoading(false);

        // Fallback to stored places only
        const storedPlaces = searchStoredPlaces || [];
        setPredictions(
          storedPlaces.map(place => ({
            place_id: place.placeId,
            description: place.formattedAddress,
            structured_formatting: {
              main_text: place.name,
              secondary_text: place.address,
            },
            types: place.types,
          }))
        );
      }
    },
    [searchStoredPlaces]
  );

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue && isOpen) {
        searchPlaces(inputValue);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, isOpen, searchPlaces]);

  // Handle place selection
  const handlePlaceSelect = async (placeId: string) => {
    if (!placesService.current) return;

    setIsLoading(true);
    
    placesService.current.getDetails(
      {
        placeId,
        fields: [
          "place_id",
          "name",
          "formatted_address",
          "geometry",
          "types",
          "vicinity",
          "business_status",
          "rating",
          "user_ratings_total",
          "formatted_phone_number",
          "website",
        ],
      },
      async (place, status) => {
        setIsLoading(false);
        
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const placeDetails: PlaceDetails = {
            place_id: place.place_id!,
            name: place.name!,
            formatted_address: place.formatted_address!,
            geometry: {
              location: {
                lat: place.geometry!.location!.lat(),
                lng: place.geometry!.location!.lng(),
              },
            },
            types: place.types || [],
            vicinity: place.vicinity,
            business_status: place.business_status,
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            formatted_phone_number: place.formatted_phone_number,
            website: place.website,
          };

          // Save to database
          try {
            await upsertPlace({
              name: placeDetails.name,
              address: placeDetails.vicinity || placeDetails.formatted_address,
              placeId: placeDetails.place_id,
              types: placeDetails.types,
              location: placeDetails.geometry.location,
              formattedAddress: placeDetails.formatted_address,
              vicinity: placeDetails.vicinity,
              businessStatus: placeDetails.business_status,
              rating: placeDetails.rating,
              userRatingsTotal: placeDetails.user_ratings_total,
              phoneNumber: placeDetails.formatted_phone_number,
              website: placeDetails.website,
            });
          } catch (error) {
            console.error("Error saving place to database:", error);
          }

          setInputValue(placeDetails.name);
          setIsOpen(false);
          setSelectedIndex(-1);
          onPlaceSelect(placeDetails);
        }
      }
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || !predictions || predictions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < predictions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < predictions.length && predictions[selectedIndex]) {
          handlePlaceSelect(predictions[selectedIndex].place_id);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const clearInput = () => {
    setInputValue("");
    setIsOpen(false);
    setPredictions([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-10 pr-10"
        />
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearInput}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (predictions?.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          <ul ref={listRef} className="py-1">
            {predictions?.map((prediction, index) => (
              <li key={prediction?.place_id || `prediction-${index}`}>
                <button
                  type="button"
                  onClick={() => prediction?.place_id && handlePlaceSelect(prediction.place_id)}
                  className={cn(
                    "w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none",
                    selectedIndex === index && "bg-gray-100 dark:bg-gray-700"
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {prediction?.structured_formatting?.main_text || 'Unknown place'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {prediction?.structured_formatting?.secondary_text || ''}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            )) || []}
          </ul>
        </div>
      )}
    </div>
  );
}
