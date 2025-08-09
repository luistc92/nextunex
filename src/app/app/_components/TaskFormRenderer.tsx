"use client";

import { SubirReporteMovimientosForm } from "./forms/SubirReporteMovimientosForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileQuestion } from "lucide-react";

interface Task {
  _id: string;
  type: "subirReporteMovimientos";
  isCompleted: boolean;
  createdAt: number;
  asignee?: string;
  variables?: any;
}

interface TaskFormRendererProps {
  task: Task | null;
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

  // Render the appropriate form based on task type
  switch (task.type) {
    case "subirReporteMovimientos":
      return (
        <SubirReporteMovimientosForm 
          task={task} 
          onTaskComplete={onTaskComplete}
        />
      );
    
    default:
      return (
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                Tipo de Tarea No Soportado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                El tipo de tarea "{task.type}" no tiene un formulario asociado.
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Información de la Tarea:
                </h4>
                <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
                  {JSON.stringify(task, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      );
  }
}
