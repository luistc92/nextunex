"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Package,
  Calendar,
  DollarSign,
  Weight,
  Building2,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Destination {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly type: "pickup" | "delivery" | "stopover";
}

interface FreightDetails {
  readonly freightNumber: string;
  readonly client: string;
  readonly weight: string;
  readonly value: string;
  readonly priority: "low" | "medium" | "high";
  readonly estimatedDelivery: string;
}

interface Freight {
  readonly id: string;
  readonly destinations: readonly Destination[];
  readonly details: FreightDetails;
}

interface FreightCardProps {
  freight: Freight;
  onEdit?: () => void;
}

export function FreightCard({ freight, onEdit }: FreightCardProps) {
  const getDestinationIcon = (type: string, index: number, total: number) => {
    if (type === "pickup") {
      return <Circle className="h-3 w-3 fill-green-500 text-green-500" />;
    } else if (type === "delivery") {
      return <MapPin className="h-3 w-3 text-red-500" />;
    } else {
      return <Circle className="h-3 w-3 fill-blue-500 text-blue-500" />;
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta";
      case "medium":
        return "Media";
      case "low":
        return "Baja";
      default:
        return priority;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <Card
      className={cn(
        "border border-gray-200 dark:border-gray-700 transition-all duration-200",
        onEdit && "cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md"
      )}
      onClick={onEdit}
    >
      <CardContent className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Destinations (Google Maps style) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Ruta
              </h4>
              <Badge variant="outline" className="text-xs">
                {freight.destinations.length} paradas
              </Badge>
            </div>
            
            <div className="space-y-2">
              {freight.destinations.map((destination, index) => (
                <div key={destination.id} className="relative">
                  <div className="flex items-start space-x-3">
                    {/* Route Line and Icon */}
                    <div className="flex flex-col items-center">
                      {getDestinationIcon(destination.type, index, freight.destinations.length)}
                      {index < freight.destinations.length - 1 && (
                        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mt-1"></div>
                      )}
                    </div>
                    
                    {/* Destination Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {destination.name}
                        </p>
                        <Badge 
                          variant="secondary" 
                          className={cn("text-xs", getDestinationColor(destination.type))}
                        >
                          {getDestinationText(destination.type)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {destination.address}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Freight Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Detalles del Flete
              </h4>
              <Badge className={cn("text-xs", getPriorityColor(freight.details.priority))}>
                Prioridad {getPriorityText(freight.details.priority)}
              </Badge>
            </div>

            <div className="space-y-3">
              {/* Freight Number */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">No. Flete:</span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {freight.details.freightNumber}
                </span>
              </div>

              {/* Client */}
              <div className="flex items-start justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Building2 className="h-3 w-3 mr-1" />
                  Cliente:
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100 text-right max-w-32 truncate">
                  {freight.details.client}
                </span>
              </div>

              {/* Weight */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Weight className="h-3 w-3 mr-1" />
                  Peso:
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {freight.details.weight}
                </span>
              </div>

              {/* Value */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Valor:
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {freight.details.value}
                </span>
              </div>

              {/* Estimated Delivery */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Entrega:
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(freight.details.estimatedDelivery)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
