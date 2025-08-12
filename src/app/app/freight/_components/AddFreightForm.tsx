"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  X, 
  MapPin, 
  Package, 
  Trash2,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Destination {
  id: string;
  name: string;
  address: string;
  type: "pickup" | "delivery" | "stopover";
}

interface FreightDetails {
  freightNumber: string;
  client: string;
  weight: string;
  value: string;
  priority: "low" | "medium" | "high";
  estimatedDelivery: string;
}

interface NewFreight {
  destinations: Destination[];
  details: FreightDetails;
}

interface AddFreightFormProps {
  truckId: string;
  truckName: string;
  onSave: (freight: NewFreight) => void;
  onCancel: () => void;
}

export function AddFreightForm({ truckId, truckName, onSave, onCancel }: AddFreightFormProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [details, setDetails] = useState<FreightDetails>({
    freightNumber: "",
    client: "",
    weight: "",
    value: "",
    priority: "medium",
    estimatedDelivery: ""
  });

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
      
      setDestinations([...destinations, destination]);
      setNewDestination({ name: "", address: "", type: "pickup" });
    }
  };

  const removeDestination = (id: string) => {
    setDestinations(destinations.filter(dest => dest.id !== id));
  };

  const handleSave = () => {
    if (destinations.length === 0) {
      alert("Agrega al menos un destino");
      return;
    }

    if (!details.freightNumber || !details.client) {
      alert("Completa los campos requeridos");
      return;
    }

    onSave({ destinations, details });
  };

  const getDestinationIcon = (type: string) => {
    switch (type) {
      case "pickup":
        return <div className="h-3 w-3 rounded-full bg-green-500"></div>;
      case "delivery":
        return <MapPin className="h-3 w-3 text-red-500" />;
      case "stopover":
        return <div className="h-3 w-3 rounded-full bg-blue-500"></div>;
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-400"></div>;
    }
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
    <Card className="border border-blue-200 dark:border-blue-800">
      <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Package className="h-5 w-5 text-blue-600 mr-2" />
            Nuevo Flete para {truckName}
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} className="cursor-pointer">
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Destinations */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Destinos
            </h3>
            
            {/* Existing Destinations */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {destinations.map((destination, index) => (
                <div key={destination.id} className="flex items-start space-x-3 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex flex-col items-center">
                    {getDestinationIcon(destination.type)}
                    {index < destinations.length - 1 && (
                      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {destination.name}
                      </p>
                      <Badge variant="secondary" className={cn("text-xs", getDestinationColor(destination.type))}>
                        {getDestinationText(destination.type)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {destination.address}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDestination(destination.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add New Destination */}
            <div className="space-y-3 p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <div className="grid grid-cols-1 gap-2">
                <Input
                  placeholder="Nombre del destino"
                  value={newDestination.name}
                  onChange={(e) => setNewDestination({...newDestination, name: e.target.value})}
                />
                <Input
                  placeholder="Dirección"
                  value={newDestination.address}
                  onChange={(e) => setNewDestination({...newDestination, address: e.target.value})}
                />
                <select
                  value={newDestination.type}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "pickup" || value === "delivery" || value === "stopover") {
                      setNewDestination({...newDestination, type: value});
                    }
                  }}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 cursor-pointer"
                >
                  <option value="pickup">Recolección</option>
                  <option value="stopover">Parada</option>
                  <option value="delivery">Entrega</option>
                </select>
              </div>
              <Button onClick={addDestination} size="sm" className="w-full cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Destino
              </Button>
            </div>
          </div>

          {/* Right Column - Freight Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Detalles del Flete
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  No. Flete *
                </label>
                <Input
                  placeholder="FL-2024-XXX"
                  value={details.freightNumber}
                  onChange={(e) => setDetails({...details, freightNumber: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cliente *
                </label>
                <Input
                  placeholder="Nombre del cliente"
                  value={details.client}
                  onChange={(e) => setDetails({...details, client: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Peso
                </label>
                <Input
                  placeholder="15.5 ton"
                  value={details.weight}
                  onChange={(e) => setDetails({...details, weight: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor
                </label>
                <Input
                  placeholder="$45,000 MXN"
                  value={details.value}
                  onChange={(e) => setDetails({...details, value: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prioridad
                </label>
                <select
                  value={details.priority}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "low" || value === "medium" || value === "high") {
                      setDetails({...details, priority: value});
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 cursor-pointer"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha de Entrega Estimada
                </label>
                <Input
                  type="date"
                  value={details.estimatedDelivery}
                  onChange={(e) => setDetails({...details, estimatedDelivery: e.target.value})}
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button onClick={handleSave} className="flex-1 cursor-pointer">
                <Save className="h-4 w-4 mr-2" />
                Guardar Flete
              </Button>
              <Button variant="outline" onClick={onCancel} className="cursor-pointer">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
