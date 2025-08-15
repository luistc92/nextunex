"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FreightCard } from "./FreightCard";
import { AddFreightForm } from "./AddFreightForm";
import { Truck, User, Circle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Truck {
  id: string;
  name: string;
  driver: string;
  status: "available" | "in-transit" | "maintenance";
}

interface TruckListProps {
  trucks: Truck[];
}

// Mock freight data for demonstration
const mockFreights = {
  "truck-002": [
    {
      id: "freight-001",
      destinations: [
        { id: "dest-1", name: "Ciudad de México", address: "Av. Insurgentes Sur 123", type: "pickup" as const },
        { id: "dest-2", name: "Guadalajara", address: "Av. López Mateos 456", type: "delivery" as const },
        { id: "dest-3", name: "Monterrey", address: "Av. Constitución 789", type: "delivery" as const }
      ],
      details: {
        freightNumber: "FL-2024-001",
        client: "Transportes ABC S.A.",
        weight: "15.5 ton",
        value: "$45,000 MXN",
        priority: "high" as const,
        estimatedDelivery: "2024-01-15"
      }
    }
  ],
  "truck-006": [
    {
      id: "freight-002",
      destinations: [
        { id: "dest-4", name: "Tijuana", address: "Blvd. Agua Caliente 321", type: "pickup" as const },
        { id: "dest-5", name: "Mexicali", address: "Av. Reforma 654", type: "delivery" as const }
      ],
      details: {
        freightNumber: "FL-2024-002",
        client: "Logística del Norte",
        weight: "8.2 ton",
        value: "$28,000 MXN",
        priority: "medium" as const,
        estimatedDelivery: "2024-01-12"
      }
    }
  ],
  "truck-009": [
    {
      id: "freight-003",
      destinations: [
        { id: "dest-6", name: "Veracruz", address: "Puerto Industrial s/n", type: "pickup" as const },
        { id: "dest-7", name: "Puebla", address: "Zona Industrial Norte", type: "stopover" as const },
        { id: "dest-8", name: "Ciudad de México", address: "Central de Abastos", type: "delivery" as const }
      ],
      details: {
        freightNumber: "FL-2024-003",
        client: "Comercial Golfo",
        weight: "22.1 ton",
        value: "$67,500 MXN",
        priority: "high" as const,
        estimatedDelivery: "2024-01-18"
      }
    }
  ],
  "truck-014": [
    {
      id: "freight-004",
      destinations: [
        { id: "dest-9", name: "Cancún", address: "Zona Hotelera Km 12", type: "pickup" as const },
        { id: "dest-10", name: "Mérida", address: "Periférico Norte 890", type: "delivery" as const }
      ],
      details: {
        freightNumber: "FL-2024-004",
        client: "Turismo Maya",
        weight: "5.8 ton",
        value: "$19,200 MXN",
        priority: "low" as const,
        estimatedDelivery: "2024-01-14"
      }
    }
  ],
  "truck-018": [
    {
      id: "freight-005",
      destinations: [
        { id: "dest-11", name: "Acapulco", address: "Puerto Comercial", type: "pickup" as const },
        { id: "dest-12", name: "Chilpancingo", address: "Centro de Distribución", type: "stopover" as const },
        { id: "dest-13", name: "Cuernavaca", address: "Parque Industrial", type: "delivery" as const }
      ],
      details: {
        freightNumber: "FL-2024-005",
        client: "Pacífico Logistics",
        weight: "18.7 ton",
        value: "$52,300 MXN",
        priority: "medium" as const,
        estimatedDelivery: "2024-01-16"
      }
    }
  ]
} as const;

export function TruckList({ trucks }: TruckListProps) {
  const [freights, setFreights] = useState(mockFreights);
  const [addingFreightFor, setAddingFreightFor] = useState<string | null>(null);
  const [editingFreight, setEditingFreight] = useState<{ truckId: string; freightId: string } | null>(null);

  const handleAddFreight = (truckId: string, newFreight: any) => {
    const freightWithId = {
      id: `freight-${Date.now()}`,
      ...newFreight
    };

    setFreights(prev => ({
      ...prev,
      [truckId]: [...(prev[truckId as keyof typeof prev] || []), freightWithId]
    }));

    setAddingFreightFor(null);
  };

  const handleEditFreight = (truckId: string, freightId: string, updatedFreight: any) => {
    setFreights(prev => ({
      ...prev,
      [truckId]: (prev[truckId as keyof typeof prev] || []).map(freight =>
        freight.id === freightId ? { ...updatedFreight, id: freightId } : freight
      )
    }));

    setEditingFreight(null);
  };

  const getFreightForEditing = (truckId: string, freightId: string) => {
    const truckFreights = freights[truckId as keyof typeof freights] || [];
    const freight = truckFreights.find(freight => freight.id === freightId);

    if (!freight) return undefined;

    // Create a mutable copy for editing
    return {
      destinations: freight.destinations.map(dest => ({
        id: dest.id,
        name: dest.name,
        address: dest.address,
        type: dest.type
      })),
      details: {
        freightNumber: freight.details.freightNumber,
        client: freight.details.client,
        weight: freight.details.weight,
        value: freight.details.value,
        priority: freight.details.priority,
        estimatedDelivery: freight.details.estimatedDelivery
      }
    };
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-100 dark:bg-green-900";
      case "in-transit":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900";
      case "maintenance":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Disponible";
      case "in-transit":
        return "En Tránsito";
      case "maintenance":
        return "Mantenimiento";
      default:
        return status;
    }
  };

  return (
    <>
      <Card className="py-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300 w-80">
                    Unidad
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fletes Asignados
                  </th>
                </tr>
              </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {trucks.map((truck) => (
                <tr key={truck.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  {/* Truck Info Column */}
                  <td className="px-6 py-4 w-80">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Truck className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {truck.name}
                        </p>
                        <div className="flex items-center mt-1">
                          <User className="h-3 w-3 text-gray-400 mr-1" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {truck.driver}
                          </p>
                        </div>
                        <div className="flex items-center mt-1">
                          <Circle className={cn("h-2 w-2 rounded-full mr-2", getStatusColor(truck.status))} />
                          <span className={cn("text-xs px-2 py-1 rounded-full font-medium", getStatusColor(truck.status))}>
                            {getStatusText(truck.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Freight Cards Column */}
                  <td className="px-6 py-4">
                    <div className="space-y-3">
                      {/* Existing Freight Cards */}
                      {freights[truck.id as keyof typeof freights]?.map((freight) => (
                        <FreightCard
                          key={freight.id}
                          freight={freight}
                          onEdit={() => setEditingFreight({ truckId: truck.id, freightId: freight.id })}
                        />
                      ))}

                      {/* Add Freight Button - full width, full height when no freights */}
                      {addingFreightFor !== truck.id && (
                        <Button
                          variant="outline"
                          onClick={() => setAddingFreightFor(truck.id)}
                          className={cn(
                            "w-full border-dashed border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer",
                            !freights[truck.id as keyof typeof freights]?.length
                              ? "h-32"
                              : ""
                          )}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Flete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    {/* Modal Overlay for Add/Edit Freight Form - Fixed positioning to float over content */}
    {(addingFreightFor || editingFreight) && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="flex-1 overflow-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {addingFreightFor && (
              <AddFreightForm
                truckId={addingFreightFor}
                truckName={trucks.find(t => t.id === addingFreightFor)?.name || ""}
                onSave={(newFreight) => handleAddFreight(addingFreightFor, newFreight)}
                onCancel={() => setAddingFreightFor(null)}
              />
            )}
            {editingFreight && (
              <AddFreightForm
                truckId={editingFreight.truckId}
                truckName={trucks.find(t => t.id === editingFreight.truckId)?.name || ""}
                initialData={getFreightForEditing(editingFreight.truckId, editingFreight.freightId)}
                isEditing={true}
                onSave={(updatedFreight) => handleEditFreight(editingFreight.truckId, editingFreight.freightId, updatedFreight)}
                onCancel={() => setEditingFreight(null)}
              />
            )}
          </div>
        </div>
      </div>
    )}
  </>
  );
}
