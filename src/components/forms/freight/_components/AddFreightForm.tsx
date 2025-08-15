"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteBuilder } from "./RouteBuilder";
import { FreightDetails } from "./FreightDetails";
import {
  X,
  Save
} from "lucide-react";

interface Destination {
  id: string;
  name: string;
  address: string;
  type: "pickup" | "delivery" | "stopover";
}

interface FreightDetailsData {
  freightNumber: string;
  client: string;
  weight: string;
  value: string;
  priority: "low" | "medium" | "high";
  estimatedDelivery: string;
}

interface NewFreight {
  destinations: Destination[];
  details: FreightDetailsData;
}

interface AddFreightFormProps {
  truckId: string;
  truckName: string;
  initialData?: NewFreight;
  isEditing?: boolean;
  onSave: (freight: NewFreight) => void;
  onCancel: () => void;
}

export function AddFreightForm({ truckId, truckName, initialData, isEditing = false, onSave, onCancel }: AddFreightFormProps) {
  const [destinations, setDestinations] = useState<Destination[]>(initialData?.destinations || []);
  const [details, setDetails] = useState<FreightDetailsData>(initialData?.details || {
    freightNumber: "",
    client: "",
    weight: "",
    value: "",
    priority: "medium",
    estimatedDelivery: ""
  });

  const handleSave = () => {
    if (destinations.length === 0) {
      alert("Agrega al menos un destino");
      return;
    }

    if (!details.freightNumber.trim() || !details.client.trim()) {
      alert("Completa los campos obligatorios");
      return;
    }

    onSave({ destinations, details });
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">
          {isEditing ? `Editar Flete para ${truckName}` : `Nuevo Flete para ${truckName}`}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Route Builder */}
          <div className="space-y-4">
            <RouteBuilder
              destinations={destinations}
              onDestinationsChange={setDestinations}
            />
          </div>

          {/* Right Column - Freight Details */}
          <div className="space-y-4">
            <FreightDetails
              details={details}
              onDetailsChange={setDetails}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="cursor-pointer">
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? "Actualizar Flete" : "Guardar Flete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}