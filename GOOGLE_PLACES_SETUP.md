# Google Places API Integration Setup

This guide will help you set up Google Places API integration with autocomplete functionality and database persistence.

## Prerequisites

1. Google Cloud Platform account
2. Google Maps Platform API key
3. Convex database setup

## Step 1: Google Cloud Setup

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one

### 1.2 Enable Required APIs
Enable the following APIs in your Google Cloud project:
- **Maps JavaScript API**
- **Places API**
- **Geocoding API** (optional, for additional features)

### 1.3 Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Recommended) Restrict the API key:
   - Application restrictions: HTTP referrers
   - Add your domain (e.g., `localhost:3000/*` for development)
   - API restrictions: Select the APIs you enabled above

## Step 2: Environment Configuration

Add your Google Maps API key to your `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Important:** Replace `your_actual_api_key_here` with your actual Google Maps API key.

## Step 3: Database Schema

The Convex schema has been updated to include a `places` table with the following fields:

- `name`: Place name
- `address`: Short address
- `placeId`: Google Place ID (unique)
- `types`: Array of place types
- `location`: Coordinates (lat, lng)
- `formattedAddress`: Full formatted address
- `vicinity`: Nearby area description
- `businessStatus`: Business operational status
- `rating`: Average rating
- `userRatingsTotal`: Number of reviews
- `phoneNumber`: Contact phone
- `website`: Business website
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Step 4: Components Overview

### PlacesAutocomplete Component
Located at: `src/components/ui/places-autocomplete.tsx`

Features:
- Real-time autocomplete suggestions
- Combines stored places with Google Places API results
- Automatic database persistence
- Keyboard navigation support
- Loading states and error handling

### GoogleMapsProvider
Located at: `src/components/providers/google-maps-provider.tsx`

Features:
- Loads Google Maps JavaScript API
- Provides context for API loading state
- Handles API loading errors

## Step 5: Usage Examples

### Basic Usage
```tsx
import { PlacesAutocomplete } from "@/components/ui/places-autocomplete";

function MyComponent() {
  return (
    <PlacesAutocomplete
      placeholder="Search for a place..."
      onPlaceSelect={(place) => {
        console.log("Selected place:", place);
        // Handle place selection
      }}
    />
  );
}
```

### In Forms (AddFreightForm)
The component has been integrated into the freight form for destination selection:

```tsx
<PlacesAutocomplete
  placeholder="Buscar lugar..."
  onPlaceSelect={(place) => {
    setNewDestination({
      ...newDestination,
      name: place.name,
      address: place.formatted_address,
    });
  }}
/>
```

## Step 6: Testing

1. Visit `/test-places` to test the autocomplete functionality
2. Try searching for various places
3. Check the Convex dashboard to see saved places
4. Verify that previously searched places appear in future searches

## Step 7: Convex Functions

The following Convex functions are available:

### Queries
- `searchPlaces`: Search places by name for autocomplete
- `getAllPlaces`: Get all stored places
- `getPlaceByPlaceId`: Get a specific place by Google Place ID

### Mutations
- `upsertPlace`: Create or update a place
- `deletePlace`: Remove a place from the database

## Troubleshooting

### Common Issues

1. **"Google Maps API not loaded"**
   - Check that your API key is correctly set in `.env.local`
   - Ensure the Maps JavaScript API is enabled in Google Cloud Console

2. **"Places API quota exceeded"**
   - Check your Google Cloud Console for API usage
   - Consider implementing request caching or rate limiting

3. **"No autocomplete suggestions"**
   - Verify the Places API is enabled
   - Check browser console for API errors
   - Ensure your API key has proper permissions

4. **"Database save errors"**
   - Check Convex dashboard for error logs
   - Verify the schema is properly deployed

### API Key Security

- Never commit API keys to version control
- Use environment variables for all API keys
- Restrict API keys to specific domains and APIs
- Monitor API usage in Google Cloud Console

## Features

### Implemented
✅ Google Places autocomplete
✅ Database persistence
✅ Keyboard navigation
✅ Loading states
✅ Error handling
✅ Integration with freight forms

### Future Enhancements
- [ ] Geolocation-based suggestions
- [ ] Place photos integration
- [ ] Offline mode with cached places
- [ ] Bulk place import
- [ ] Place categories and filtering
- [ ] Map visualization of selected places

## Support

For issues related to:
- Google Maps API: Check [Google Maps Platform documentation](https://developers.google.com/maps/documentation)
- Convex database: Check [Convex documentation](https://docs.convex.dev/)
- React components: Check component source code and comments
