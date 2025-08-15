"use client";

import { Input } from "@/components/ui/input";
import { Package } from "lucide-react";

interface FreightDetailsData {
  freightNumber: string;
  client: string;
  weight: string;
  value: string;
  priority: "low" | "medium" | "high";
  estimatedDelivery: string;
}

interface FreightDetailsProps {
  details: FreightDetailsData;
  onDetailsChange: (details: FreightDetailsData) => void;
  className?: string;
}

export function FreightDetails({ details, onDetailsChange, className }: FreightDetailsProps) {
  const updateDetail = (field: keyof FreightDetailsData, value: string) => {
    onDetailsChange({
      ...details,
      [field]: value
    });
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

  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-4">
        <Package className="h-4 w-4 mr-2" />
        Detalles del Flete
      </h3>
      
      <div className="space-y-4">
        {/* Freight Number */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            No. Flete *
          </label>
          <Input
            placeholder="FL-2024-XXX"
            value={details.freightNumber}
            onChange={(e) => updateDetail('freightNumber', e.target.value)}
          />
        </div>

        {/* Client */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cliente *
          </label>
          <Input
            placeholder="Nombre del cliente"
            value={details.client}
            onChange={(e) => updateDetail('client', e.target.value)}
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Peso
          </label>
          <Input
            placeholder="15.5 ton"
            value={details.weight}
            onChange={(e) => updateDetail('weight', e.target.value)}
          />
        </div>

        {/* Value */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Valor
          </label>
          <Input
            placeholder="$45,000 MXN"
            value={details.value}
            onChange={(e) => updateDetail('value', e.target.value)}
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Prioridad
          </label>
          <select
            value={details.priority}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "low" || value === "medium" || value === "high") {
                updateDetail('priority', value);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 cursor-pointer"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(details.priority)}`}>
              Prioridad {getPriorityText(details.priority)}
            </span>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha Estimada de Entrega
          </label>
          <Input
            type="date"
            value={details.estimatedDelivery}
            onChange={(e) => updateDetail('estimatedDelivery', e.target.value)}
          />
        </div>

        {/* Additional Information Section */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
            Información Adicional
          </h4>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Estado:</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">Pendiente</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Tipo:</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">Carga General</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Creado:</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {new Date().toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Modificado:</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {new Date().toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
            Resumen
          </h4>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Número de Flete:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {details.freightNumber || 'Sin asignar'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Cliente:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {details.client || 'Sin asignar'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Peso Total:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {details.weight || 'Sin especificar'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Valor:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {details.value || 'Sin especificar'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
