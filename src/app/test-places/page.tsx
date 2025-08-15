"use client";

import { useState } from "react";
import { PlacesAutocomplete } from "@/components/ui/places-autocomplete";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoogleMapsLoaded } from "@/components/providers/google-maps-provider";

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

export default function TestPlacesPage() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const { isLoaded, loadError } = useGoogleMapsLoaded();

  if (loadError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error loading Google Maps: {loadError.message}</p>
            <p className="text-sm text-gray-600 mt-2">
              Please check your Google Maps API key in the environment variables.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p>Loading Google Maps...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google Places Autocomplete Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Search for a place:
            </label>
            <PlacesAutocomplete
              placeholder="Type to search for places..."
              onPlaceSelect={(place) => {
                console.log("Selected place:", place);
                setSelectedPlace(place);
              }}
              className="max-w-md"
            />
          </div>

          {selectedPlace && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Selected Place Details:</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                <p><strong>Name:</strong> {selectedPlace.name}</p>
                <p><strong>Address:</strong> {selectedPlace.formatted_address}</p>
                <p><strong>Place ID:</strong> {selectedPlace.place_id}</p>
                <p><strong>Coordinates:</strong> {selectedPlace.geometry.location.lat}, {selectedPlace.geometry.location.lng}</p>
                <p><strong>Types:</strong> {selectedPlace.types.join(", ")}</p>
                {selectedPlace.vicinity && (
                  <p><strong>Vicinity:</strong> {selectedPlace.vicinity}</p>
                )}
                {selectedPlace.rating && (
                  <p><strong>Rating:</strong> {selectedPlace.rating} ({selectedPlace.user_ratings_total} reviews)</p>
                )}
                {selectedPlace.formatted_phone_number && (
                  <p><strong>Phone:</strong> {selectedPlace.formatted_phone_number}</p>
                )}
                {selectedPlace.website && (
                  <p><strong>Website:</strong> <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedPlace.website}</a></p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>1. Make sure you have a valid Google Maps API key set in your environment variables</p>
            <p>2. The API key should be in <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code></p>
            <p>3. Enable the Places API in your Google Cloud Console</p>
            <p>4. Start typing in the search box above to see autocomplete suggestions</p>
            <p>5. Selected places will be automatically saved to your Convex database</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
