"use client";

import { useState, useEffect } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle2, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import type { Doc } from "../../../convex/_generated/dataModel";
import {
  CamundaText,
  CamundaTextfield,
  CamundaTextarea,
  CamundaCheckbox,
  CamundaFilepicker,
  type CamundaComponentType
} from "./camunda";

interface CamundaFormComponent {
  id: string;
  key?: string;
  label?: string;
  type: string;
  text?: string;
  layout: {
    row: string;
    columns: null | number;
  };
}

interface CamundaFormDefinition {
  components: CamundaFormComponent[];
  type: string;
  id: string;
  exporter: {
    name: string;
    version: string;
  };
  executionPlatform: string;
  executionPlatformVersion: string;
  schemaVersion: number;
}

interface DynamicCamundaFormProps {
  task: Doc<"tasks">;
  onTaskComplete?: () => void;
}

export function DynamicCamundaForm({ task, onTaskComplete }: DynamicCamundaFormProps) {
  const fetchCamundaFormSchema = useAction(api.actions.fetchCamundaFormSchema);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formDefinition, setFormDefinition] = useState<CamundaFormDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const toggleTask = useMutation(api.internalAPI.tasks.toggleTask);

  // Fetch form schema from Camunda API
  const fetchFormSchema = async () => {
    setLoading(true);
    setError(null);

    try {

      if (!task.camundaId) {
        setError('No se pudo obtener el ID de la tarea de Camunda');
        return;
      }

      const result = await fetchCamundaFormSchema({
        camundaId: task.camundaId,
        camundaBaseUrl: process.env.NEXT_PUBLIC_CAMUNDA_BASE_URL || "",
        authToken: process.env.NEXT_PUBLIC_CAMUNDA_AUTH_TOKEN || undefined
      });

      if (result.success && result.data) {
        setFormDefinition(result.data);
      } else {
        setError(result.error || 'Failed to fetch form schema from Camunda');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch form schema on component mount
  useEffect(() => {
    fetchFormSchema();
  }, [task._id]);

  // Loading state
  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Cargando formulario desde Camunda...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            Error al Cargar Formulario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={fetchFormSchema} variant="outline" className="cursor-pointer">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  // No form definition
  if (!formDefinition) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            Formulario No Disponible
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            No se encontró la definición del formulario para esta tarea.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFileChange = (key: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [key]: file
    }));
  };

  const renderFormComponent = (component: CamundaFormComponent) => {
    const { id, key, label, type, text } = component;
    const fieldKey = key || id;

    switch (type as CamundaComponentType) {
      case "text":
        return (
          <CamundaText
            key={id}
            id={id}
            text={text}
          />
        );

      case "textfield":
        return (
          <CamundaTextfield
            key={id}
            id={id}
            camundaKey={key}
            label={label}
            value={formData[fieldKey] || ""}
            onChange={handleInputChange}
          />
        );

      case "textarea":
        return (
          <CamundaTextarea
            key={id}
            id={id}
            camundaKey={key}
            label={label}
            value={formData[fieldKey] || ""}
            onChange={handleInputChange}
          />
        );

      case "checkbox":
        return (
          <CamundaCheckbox
            key={id}
            id={id}
            camundaKey={key}
            label={label}
            value={formData[fieldKey] || false}
            onChange={handleInputChange}
          />
        );

      case "filepicker":
        return (
          <CamundaFilepicker
            key={id}
            id={id}
            camundaKey={key}
            label={label}
            value={formData[fieldKey] || null}
            onChange={handleFileChange}
          />
        );

      default:
        return (
          <div key={id} className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Tipo de campo no soportado: {type}
            </p>
          </div>
        );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setUploading(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark task as completed (only for non-permanent tasks)
      if (!task.permanent) {
        await toggleTask({ id: task._id });
      }
      
      // Notify parent component
      onTaskComplete?.();
      
      alert('Formulario enviado exitosamente');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error al enviar el formulario. Por favor intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          {formDefinition.id || "Formulario Dinámico"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formDefinition.components.map(component => renderFormComponent(component))}
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={fetchFormSchema} variant="outline" type="button" className="cursor-pointer">
              <RefreshCw className="h-4 w-4 mr-2" />
              Recargar Formulario
            </Button>
            <Button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Enviar Formulario
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
