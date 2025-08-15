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
  CamundaNumber,
  CamundaDatetime,
  CamundaExpression,
  CamundaChecklist,
  CamundaRadio,
  CamundaSelect,
  CamundaTaglist,
  type CamundaComponentType
} from "./camunda";

interface CamundaFormComponent {
  id: string;
  key?: string;
  label?: string;
  type: string;
  text?: string;
  description?: string;
  defaultValue?: any;
  decimalDigits?: number;
  increment?: string;
  disabled?: boolean;
  readonly?: string | boolean;
  // Datetime specific properties
  subtype?: "date" | "datetime" | "time";
  dateLabel?: string;
  disallowPassedDates?: boolean;
  // Expression specific properties
  expression?: string;
  computeOn?: string;
  // Filepicker specific properties
  multiple?: string | boolean;
  accept?: string;
  // Checklist and Select specific properties
  values?: Array<{ label: string; value: string }>;
  valuesKey?: string;
  valuesExpression?: string;
  // Select specific properties
  searchable?: boolean;
  appearance?: {
    prefixAdorner?: string;
    suffixAdorner?: string;
  };
  validate?: {
    required?: boolean;
    min?: string | number;
    max?: string | number;
  };
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
  const completeCamundaTask = useAction(api.actions.completeCamundaTask);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formDefinition, setFormDefinition] = useState<CamundaFormDefinition | null>(null);
  const [loading, setLoading] = useState(true);
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

  // Build Camunda variables format from form data
  const buildFormVariables = () => {
    const variables: Record<string, { value: any }> = {};

    // Only include form fields that have a key (Camunda field key)
    if (formDefinition?.components) {
      formDefinition.components.forEach(component => {
        if (component.key && formData.hasOwnProperty(component.id)) {
          variables[component.key] = {
            value: formData[component.id]
          };
        }
      });
    }

    return variables;
  };

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

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFileChange = (id: string, value: File | File[] | null) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const renderFormComponent = (component: CamundaFormComponent) => {
    const { id, key, label, type, text } = component;

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
            value={formData[id] || ""}
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
            value={formData[id] || ""}
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
            value={formData[id] || false}
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
            value={formData[id] || null}
            required={component.validate?.required}
            disabled={component.disabled}
            accept={component.accept}
            multiple={component.multiple === true || component.multiple === "on"}
            onChange={handleFileChange}
          />
        );

      case "number":
        return (
          <CamundaNumber
            key={id}
            id={id}
            camundaKey={key}
            label={label}
            description={component.description}
            value={formData[id]}
            defaultValue={component.defaultValue}
            required={component.validate?.required}
            disabled={component.disabled}
            readonly={component.readonly === true || component.readonly === "on"}
            min={typeof component.validate?.min === 'number' ? component.validate.min :
                 typeof component.validate?.min === 'string' ? parseFloat(component.validate.min) : undefined}
            max={typeof component.validate?.max === 'number' ? component.validate.max :
                 typeof component.validate?.max === 'string' ? parseFloat(component.validate.max) : undefined}
            step={component.increment ? parseFloat(component.increment) : undefined}
            decimalDigits={component.decimalDigits}
            prefixAdorner={component.appearance?.prefixAdorner}
            suffixAdorner={component.appearance?.suffixAdorner}
            onChange={handleInputChange}
          />
        );

      case "datetime":
        return (
          <CamundaDatetime
            key={id}
            id={id}
            camundaKey={key}
            label={label}
            dateLabel={component.dateLabel}
            description={component.description}
            subtype={component.subtype || "date"}
            value={formData[id] || ""}
            required={component.validate?.required}
            disabled={component.disabled}
            readonly={component.readonly === true || component.readonly === "on"}
            disallowPassedDates={component.disallowPassedDates}
            onChange={handleInputChange}
          />
        );

      case "expression":
        return (
          <CamundaExpression
            key={id}
            id={id}
            camundaKey={key}
            expression={component.expression || ""}
            formData={formData}
            onChange={handleInputChange}
          />
        );

      case "checklist":
        return (
          <CamundaChecklist
            key={id}
            id={id}
            camundaKey={key}
            label={label}
            description={component.description}
            values={component.values}
            valuesKey={component.valuesKey}
            valuesExpression={component.valuesExpression}
            value={formData[id] || []}
            required={component.validate?.required}
            disabled={component.disabled}
            formData={formData}
            onChange={handleInputChange}
          />
        );

      case "radio":
        return (
          <CamundaRadio
            key={id}
            id={id}
            camundaKey={key}
            label={label}
            description={component.description}
            values={component.values}
            valuesKey={component.valuesKey}
            valuesExpression={component.valuesExpression}
            value={formData[id] || ""}
            required={component.validate?.required}
            disabled={component.disabled}
            formData={formData}
            onChange={handleInputChange}
          />
        );

      case "select":
        return (
          <CamundaSelect
            key={id}
            id={id}
            camundaKey={key}
            label={label}
            description={component.description}
            values={component.values}
            valuesKey={component.valuesKey}
            valuesExpression={component.valuesExpression}
            value={formData[id] || ""}
            defaultValue={component.defaultValue}
            searchable={component.searchable}
            required={component.validate?.required}
            disabled={component.disabled}
            formData={formData}
            onChange={handleInputChange}
          />
        );

      case "taglist":
        return (
          <CamundaTaglist
            key={id}
            id={id}
            camundaKey={key}
            label={label}
            description={component.description}
            values={component.values}
            valuesKey={component.valuesKey}
            valuesExpression={component.valuesExpression}
            value={formData[id] || []}
            required={component.validate?.required}
            disabled={component.disabled}
            formData={formData}
            onChange={handleInputChange}
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
      // Complete the Camunda task
      const result = await completeCamundaTask({
        camundaId: task.camundaId || "",
        camundaBaseUrl: process.env.NEXT_PUBLIC_CAMUNDA_BASE_URL || "",
        authToken: process.env.NEXT_PUBLIC_CAMUNDA_AUTH_TOKEN || undefined,
        variables: buildFormVariables()
      });

      // Check if the Camunda API call was successful
      if (!result.success) {
        throw new Error(result.error || 'Failed to complete Camunda task');
      }

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
