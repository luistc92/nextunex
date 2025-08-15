"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlacesAutocomplete } from "@/components/ui/places-autocomplete";
import { 
  Plus, 
  X, 
  MapPin, 
  Circle,
  Search,
  GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Destination {
  id: string;
  name: string;
  address: string;
  type: "pickup" | "delivery" | "stopover";
}

interface RouteBuilderProps {
  destinations: Destination[];
  onDestinationsChange: (destinations: Destination[]) => void;
  className?: string;
}

export function RouteBuilder({ destinations, onDestinationsChange, className }: RouteBuilderProps) {
  const [newDestination, setNewDestination] = useState<{
    name: string;
    address: string;
    type: "pickup" | "delivery" | "stopover";
  }>({
    name: "",
    address: "",
    type: "pickup"
  });

  const addDestination = () => {
    if (newDestination.name.trim() && newDestination.address.trim()) {
      const destination: Destination = {
        id: `dest-${Date.now()}`,
        name: newDestination.name.trim(),
        address: newDestination.address.trim(),
        type: newDestination.type
      };
      
      onDestinationsChange([...destinations, destination]);
      setNewDestination({ name: "", address: "", type: "pickup" });
    }
  };

  const removeDestination = (id: string) => {
    onDestinationsChange(destinations.filter(dest => dest.id !== id));
  };

  const getDestinationColor = (type: string) => {
    switch (type) {
      case "pickup":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      case "delivery":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      case "stopover":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getDestinationText = (type: string) => {
    switch (type) {
      case "pickup":
        return "Recolección";
      case "delivery":
        return "Entrega";
      case "stopover":
        return "Parada";
      default:
        return type;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
        <MapPin className="h-4 w-4 mr-2" />
        Ruta de Destinos
      </h3>
      
      {/* Route-style Destinations List */}
      <div className="space-y-0">
        {destinations.map((destination, index) => (
          <div key={destination.id} className="relative">
            {/* Route Item */}
            <div className="flex items-center space-x-3 group">
              {/* Route Icon and Line */}
              <div className="flex flex-col items-center relative">
                {/* Route Icon */}
                <div className="relative z-10">
                  {destination.type === "pickup" ? (
                    <Circle className="h-4 w-4 fill-green-500 text-green-500" />
                  ) : destination.type === "delivery" ? (
                    <MapPin className="h-4 w-4 text-red-500" />
                  ) : (
                    <Circle className="h-4 w-4 fill-blue-500 text-blue-500" />
                  )}
                </div>
                {/* Connecting Line */}
                {index < destinations.length - 1 && (
                  <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 absolute top-4"></div>
                )}
                {/* Dotted line for spacing */}
                {index < destinations.length - 1 && (
                  <div className="w-px h-2 border-l-2 border-dotted border-gray-300 dark:border-gray-600 absolute top-12"></div>
                )}
              </div>

              {/* Destination Content */}
              <div className="flex-1 min-w-0 py-2">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 group-hover:border-gray-300 dark:group-hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {destination.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                        {destination.address}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs", getDestinationColor(destination.type))}
                      >
                        {getDestinationText(destination.type)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDestination(destination.id)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Destination - Route Style */}
      <div className="relative">
        <div className="flex items-center space-x-3">
          {/* Route Icon */}
          <div className="flex flex-col items-center relative">
            <div className="relative z-10">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            {destinations.length > 0 && (
              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 absolute -top-8"></div>
            )}
          </div>

          {/* Add Destination Content */}
          <div className="flex-1 min-w-0 py-2">
            <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg px-4 py-3">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Elige un destino o haz clic en el mapa
                  </span>
                </div>
                
                <div className="space-y-2">
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
                  
                  <div className="flex space-x-2">
                    <select
                      value={newDestination.type}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "pickup" || value === "delivery" || value === "stopover") {
                          setNewDestination({...newDestination, type: value});
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 cursor-pointer text-sm"
                    >
                      <option value="pickup">Recolección</option>
                      <option value="stopover">Parada</option>
                      <option value="delivery">Entrega</option>
                    </select>
                    
                    <Button 
                      onClick={addDestination} 
                      size="sm" 
                      className="cursor-pointer"
                      disabled={!newDestination.name || !newDestination.address}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative: Simple Add Button when no destinations */}
      {destinations.length === 0 && (
        <div className="text-center py-6">
          <Button
            variant="outline"
            onClick={() => {
              // Focus on the places autocomplete input
              const input = document.querySelector('input[placeholder="Buscar lugar..."]') as HTMLInputElement;
              input?.focus();
            }}
            className="border-dashed border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir destino
          </Button>
        </div>
      )}
    </div>
  );
}
