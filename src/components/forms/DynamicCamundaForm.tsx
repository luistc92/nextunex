"use client";

import { useState, useEffect, useRef } from "react";
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
  CamundaGroup,
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
  // Group specific properties
  components?: CamundaFormComponent[];
  path?: string;
  showOutline?: boolean;
  // External data properties
  properties?: {
    externalData?: string;
    [key: string]: any;
  };
  externalDataResult?: any;
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
  const generateUploadUrl = useMutation(api.internalAPI.files.generateUploadUrl);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formDefinition, setFormDefinition] = useState<CamundaFormDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Track the last fetched task ID to prevent unnecessary re-fetches
  const lastFetchedTaskId = useRef<string | null>(null);

  console.log(task.variables)

    // Helper function to flatten nested variables for form initialization
  const flattenVariables = (variables: Record<string, any>, prefix = ''): Record<string, any> => {
    const flattened: Record<string, any> = {};

    for (const [key, value] of Object.entries(variables)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof File)) {
        // If it's a nested object, flatten it recursively
        Object.assign(flattened, flattenVariables(value, fullKey));
      } else {
        // It's a primitive value, file, or array
        flattened[fullKey] = value;
      }
    }

    return flattened;
  };



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
        variables: task.variables
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
    // Only fetch if the task ID has actually changed
    if (lastFetchedTaskId.current !== task._id) {
      lastFetchedTaskId.current = task._id;
      fetchFormSchema();
      console.log('Initializing form data with task variables:', task.variables);
      const flattenedVariables = flattenVariables(task.variables);
      console.log('Flattened variables for form:', flattenedVariables);
      setFormData(flattenedVariables);
    } 
  }, [task._id]);

  //Function to upload a file to convex storage
  const uploadFile = async  (file: File) =>{
      // Step 1: Get a short-lived upload URL
    const uploadUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file!.type },
      body: file,
    });
    const { storageId } = await result.json();

    return storageId;
    }

  // Helper function to process components recursively
  const processComponentsRecursively = async (
    components: CamundaFormComponent[],
    currentPath: string = ""
  ): Promise<Record<string, { value: any; type?: string }>> => {
    const variables: Record<string, { value: any; type?: string }> = {};

    for (const component of components) {
      if (component.type === "group") {
        // Handle group components
        if (component.components && component.components.length > 0) {
          const groupPath = component.path ?
            (currentPath ? `${currentPath}.${component.path}` : component.path) :
            currentPath;

          const groupVariables = await processComponentsRecursively(component.components, groupPath);

          if (component.path) {
            // If group has a path, nest the variables under that path
            variables[component.path] = {
              value: Object.fromEntries(
                Object.entries(groupVariables).map(([key, val]) => [key, val.value])
              )
            };
          } else {
            // If no path, merge variables at current level
            Object.assign(variables, groupVariables);
          }
        }
      } else if (component.key) {
        // Handle regular components with keys
        const fullPath = currentPath ? `${currentPath}.${component.key}` : component.key;
        const value = getNestedValue(formData, fullPath);

        if (value !== undefined) {
          // Check if the value is a File object or array of File objects
          if (value instanceof File) {
            // Single file
            const storageId: string | null = await uploadFile(value);
            if (storageId) {
              variables[component.key] = {
                value: storageId
              };
            }
          } else if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
            // Array of files - store each file and collect storage IDs
            const storageIds: string[] = [];
            for (const file of value) {
              if (file instanceof File) {
                const storageId: string | null = await uploadFile(file);
                if (storageId) {
                  storageIds.push(storageId);
                }
              }
            }
            if (storageIds.length > 0) {
              variables[component.key] = {
                value: storageIds
              };
            }
          } else {
            // Regular form field
            variables[component.key] = {
              value: value
            };
          }
        }
      }
    }

    return variables;
  };

  // Build Camunda variables format from form data
  const buildFormVariablesandFiles = async () => {
    const variables = formDefinition?.components ?
      await processComponentsRecursively(formDefinition.components) :
      {};

    // Inject external data results as variables for dynamic lists
    if (formDefinition?.components) {
      console.log("Injecting external data as variables...");
      injectExternalDataAsVariables(formDefinition.components, variables);
    }

    console.log("las variables son", variables);
    return { variables };
  };

  // Helper function to inject external data results as variables
  const injectExternalDataAsVariables = (components: CamundaFormComponent[], variables: Record<string, { value: any; type?: string }>) => {
    for (const component of components) {
      // Handle nested components (like groups)
      if (component.components && component.components.length > 0) {
        injectExternalDataAsVariables(component.components, variables);
      }

      // Check if component has external data result and should be injected as a variable
      if (component.externalDataResult && component.key) {
        // For components like "recorridosAnteriores", inject the external data as a variable
        variables[component.key] = {
          value: component.externalDataResult
        };
        console.log(`Injected external data as variable ${component.key}:`, component.externalDataResult);
      }
    }
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

  // Helper function to set nested values in form data
  const setNestedValue = (obj: Record<string, any>, path: string, value: any): Record<string, any> => {
    const keys = path.split('.').filter(k => k.length > 0);
    const result = { ...obj };
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]!;
      if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
        current[key] = {};
      } else {
        current[key] = { ...current[key] };
      }
      current = current[key];
    }

    const lastKey = keys[keys.length - 1]!;
    current[lastKey] = value;
    return result;
  };

  // Helper function to get nested values from form data
  const getNestedValue = (obj: Record<string, any>, path: string): any => {
    const keys = path.split('.').filter(k => k.length > 0);
    let current = obj;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return current;
  };

  const handleInputChange = (camundaKey: string, value: any, groupPath?: string) => {
    setFormData(prev => {
      if (groupPath) {
        // Handle nested group data
        const fullPath = `${groupPath}.${camundaKey}`;
        return setNestedValue(prev, fullPath, value);
      } else {
        // Handle top-level data
        return {
          ...prev,
          [camundaKey]: value
        };
      }
    });
  };

  const handleFileChange = (camundaKey: string, value: File | File[] | null, groupPath?: string) => {
    console.log("DynamicCamundaForm - File change:", camundaKey, value);
    setFormData(prev => {
      if (groupPath) {
        // Handle nested group data
        const fullPath = `${groupPath}.${camundaKey}`;
        const newData = setNestedValue(prev, fullPath, value);
        console.log("DynamicCamundaForm - New nested form data:", newData);
        return newData;
      } else {
        // Handle top-level data
        const newData = {
          ...prev,
          [camundaKey]: value
        };
        console.log("DynamicCamundaForm - New form data:", newData);
        return newData;
      }
    });
  };

  const renderFormComponent = (component: CamundaFormComponent, groupPath?: string): React.ReactNode => {
    const { id, key, label, type, text } = component;

    const camundaKey = key || "";

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
            camundaKey={camundaKey}
            label={label}
            value={getNestedValue(formData, groupPath ? `${groupPath}.${camundaKey}` : camundaKey) || ""}
            onChange={(key, value) => handleInputChange(key, value, groupPath)}
          />
        );

      case "textarea":
        return (
          <CamundaTextarea
            key={id}
            id={id}
            camundaKey={camundaKey}
            label={label}
            value={getNestedValue(formData, groupPath ? `${groupPath}.${camundaKey}` : camundaKey) || ""}
            onChange={(key, value) => handleInputChange(key, value, groupPath)}
          />
        );

      case "checkbox":
        return (
          <CamundaCheckbox
            key={id}
            id={id}
            camundaKey={camundaKey}
            label={label}
            value={getNestedValue(formData, groupPath ? `${groupPath}.${camundaKey}` : camundaKey) || false}
            onChange={(key, value) => handleInputChange(key, value, groupPath)}
          />
        );

      case "filepicker":
        return (
          <CamundaFilepicker
            key={id}
            id={id}
            camundaKey={camundaKey}
            label={label}
            value={getNestedValue(formData, groupPath ? `${groupPath}.${camundaKey}` : camundaKey) || null}
            required={component.validate?.required}
            disabled={component.disabled}
            accept={component.accept}
            multiple={component.multiple === true || component.multiple === "on"}
            onChange={(key, value) => handleFileChange(key, value, groupPath)}
          />
        );

      case "number":
        return (
          <CamundaNumber
            key={id}
            id={id}
            camundaKey={camundaKey}
            label={label}
            description={component.description}
            value={getNestedValue(formData, groupPath ? `${groupPath}.${camundaKey}` : camundaKey)}
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
            onChange={(key, value) => handleInputChange(key, value, groupPath)}
          />
        );

      case "datetime":
        return (
          <CamundaDatetime
            key={id}
            id={id}
            camundaKey={camundaKey}
            label={label}
            dateLabel={component.dateLabel}
            description={component.description}
            subtype={component.subtype || "date"}
            value={getNestedValue(formData, groupPath ? `${groupPath}.${camundaKey}` : camundaKey) || ""}
            required={component.validate?.required}
            disabled={component.disabled}
            readonly={component.readonly === true || component.readonly === "on"}
            disallowPassedDates={component.disallowPassedDates}
            onChange={(key, value) => handleInputChange(key, value, groupPath)}
          />
        );

      case "expression":
        return (
          <CamundaExpression
            key={id}
            id={id}
            camundaKey={camundaKey}
            expression={component.expression || ""}
            formData={formData}
            onChange={(key, value) => handleInputChange(key, value, groupPath)}
          />
        );

      case "checklist":
        return (
          <CamundaChecklist
            key={id}
            id={id}
            camundaKey={camundaKey}
            label={label}
            description={component.description}
            values={component.values}
            valuesKey={component.valuesKey}
            valuesExpression={component.valuesExpression}
            value={getNestedValue(formData, groupPath ? `${groupPath}.${camundaKey}` : camundaKey) || []}
            required={component.validate?.required}
            disabled={component.disabled}
            formData={formData}
            onChange={(key, value) => handleInputChange(key, value, groupPath)}
          />
        );

      case "radio":
        return (
          <CamundaRadio
            key={id}
            id={id}
            camundaKey={camundaKey}
            label={label}
            description={component.description}
            values={component.values}
            valuesKey={component.valuesKey}
            valuesExpression={component.valuesExpression}
            value={getNestedValue(formData, groupPath ? `${groupPath}.${camundaKey}` : camundaKey) || ""}
            required={component.validate?.required}
            disabled={component.disabled}
            formData={formData}
            onChange={(key, value) => handleInputChange(key, value, groupPath)}
          />
        );

      case "select":
        return (
          <CamundaSelect
            key={id}
            id={id}
            camundaKey={camundaKey}
            label={label}
            description={component.description}
            values={component.values}
            valuesKey={component.valuesKey}
            valuesExpression={component.valuesExpression}
            value={getNestedValue(formData, groupPath ? `${groupPath}.${camundaKey}` : camundaKey) || ""}
            defaultValue={component.defaultValue}
            searchable={component.searchable}
            required={component.validate?.required}
            disabled={component.disabled}
            formData={formData}
            onChange={(key, value) => handleInputChange(key, value, groupPath)}
          />
        );

      case "taglist":
        return (
          <CamundaTaglist
            key={id}
            id={id}
            camundaKey={camundaKey}
            label={label}
            description={component.description}
            values={component.values}
            valuesKey={component.valuesKey}
            valuesExpression={component.valuesExpression}
            value={getNestedValue(formData, groupPath ? `${groupPath}.${camundaKey}` : camundaKey) || []}
            required={component.validate?.required}
            disabled={component.disabled}
            formData={formData}
            onChange={(key, value) => handleInputChange(key, value, groupPath)}
          />
        );

      case "group":
        return (
          <CamundaGroup
            key={id}
            id={id}
            label={label}
            components={component.components || []}
            path={component.path}
            showOutline={component.showOutline}
            formData={formData}
            renderComponent={(childComponent) =>
              renderFormComponent(childComponent, component.path ?
                (groupPath ? `${groupPath}.${component.path}` : component.path) :
                groupPath
              )
            }
          />
        );

      case "dynamiclist":
        return (
          <div key={id} className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Componente "dynamiclist" no implementado aún: {label || id}
            </p>
          </div>
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
      console.log("aqui antes")
      const variablesAndFiles = await buildFormVariablesandFiles()
      const result = await completeCamundaTask({
        camundaId: task.camundaId || "",
        variables: variablesAndFiles.variables,
      });

      console.log("aqui despues")

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

