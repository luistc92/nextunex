"use client";
import { SubirReporteMovimientosForm } from "../../../components/forms/SubirReporteMovimientosForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileQuestion, FileText, Settings, Loader2 } from "lucide-react";
import type { Doc } from "../../../../convex/_generated/dataModel";
import FreightPage from "@/components/forms/freight/page";
import dynamic from "next/dynamic";

// Import FormViewer with no SSR to avoid browser API issues
const FormViewer = dynamic(() => import("../../../components/forms/FormViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Cargando formulario...</p>
      </div>
    </div>
  ),
});
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { DynamicCamundaForm } from "@/components/forms/DynamicCamundaForm";

interface TaskFormRendererProps {
  task: Doc<"tasks"> | null;
  onTaskComplete?: () => void;
}





export function TaskFormRenderer({ task, onTaskComplete }: TaskFormRendererProps) {


  if (!task) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <FileQuestion className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selecciona una Tarea
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Elige una tarea de la lista para ver y completar el formulario correspondiente.
          </p>
        </div>
      </div>
    );
  }


  // 1. Check if task has formRef - use FormViewer (Camunda embedded forms)
  if (task.formRef) {
      return (
        <FormViewer
          task = {task}
          onTaskComplete={onTaskComplete}
        />
      );
    }


  // 2. Check if task has formKey and it exists in our mappings - use custom forms
  if (task.formKey) {
    switch (task.formKey) {
      case "subirReporteMovimientos":
      case "reporteMovimientos":
        return (
          <SubirReporteMovimientosForm
            task={task}
            onTaskComplete={onTaskComplete}
          />
        );
      case "fletes":
        return <FreightPage />;
      default:
        // FormKey exists but not in our mappings - continue to "no form configured"
        break;
    }
  }

  // 3. No form configured - show informational card
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          <FileQuestion className="h-5 w-5 mr-2" />
          Formulario No Configurado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Esta tarea no tiene un formulario configurado.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Información de la Tarea:
          </h4>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <div><strong>ID:</strong> {task.camundaId || task._id}</div>
            <div><strong>Nombre:</strong> {task.name || "Sin nombre"}</div>
            <div><strong>Asignado a:</strong> {task.asignee || "No asignado"}</div>
            <div><strong>Form Key:</strong> {task.formKey || "No definido"}</div>
            <div><strong>Form Ref:</strong> {task.formRef || "No definido"}</div>
            <div><strong>Task Definition Key:</strong> {task.taskDefinitionKey || "No definido"}</div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Para configurar un formulario:
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
            <li>Agrega un <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">formRef</code> para usar formularios embebidos de Camunda</li>
            <li>Agrega un <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">formKey</code> para usar formularios personalizados</li>
            <li>Configura el mapeo en <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">FORM_KEY_MAPPINGS</code></li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
