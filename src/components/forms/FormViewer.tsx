"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Form } from "@bpmn-io/form-js";
import "@bpmn-io/form-js/dist/assets/form-js.css"; // remove if styling from scratch
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";

type FormViewerProps = {
  task: Doc<"tasks">;
  onTaskComplete?: () => void;
};

// ---- helpers ----
function camundaToForm(variables: any) {
  console.log("camunda to form", variables)
  if (!variables || typeof variables !== 'object') return variables;

  const convertedVariables = { ...variables };

  for (const key in convertedVariables) {
    const value = convertedVariables[key];

    // Check if this looks like a JSON string (starts with [ or {)
    if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
      try {
        const parsedValue = JSON.parse(value);
        convertedVariables[key] = parsedValue;
        console.log(`Parsed JSON for key ${key}:`, parsedValue);
      } catch (error) {
        console.warn(`Failed to parse JSON for key ${key}:`, value, error);
        // Keep original value if parsing fails
      }
    }
    // Check if this looks like a Camunda date string
    else if (typeof value === 'string' && isDateString(value)) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          // Convert to ISO format for form-js
          convertedVariables[key] = date.toISOString();
        }
      } catch (error) {
        console.warn(`Failed to convert date for key ${key}:`, value);
      }
    }
  }

  console.log(convertedVariables)
  return convertedVariables;
}



async function formToCamunda(variables: any,  files?: Map<string, File[]>, uploadFile?: any) {
  if (!variables || typeof variables !== 'object') return variables;
  console.log("Files are", files)
  const convertedVariables = { ...variables };

  for (const key in convertedVariables) {
    const value = convertedVariables[key];

    // Check if this looks like an ISO date string from form-js
    if (typeof value === 'string' && isISODateString(value)) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          // Format exactly like AppScript: Utilities.formatDate(date, 'UTC', "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
          
          convertedVariables[key] = {value: date.toISOString().replace('Z', '+0000'), type: "Date"};
        }
      } catch (error) {
        console.warn(`Failed to convert date for key ${key}:`, value);
      }
    } else if (typeof value === 'string' && value.startsWith('files::')) {
      // Handle file references
      
      try {
        // Array of files - store each file and collect storage IDs
            const storageIds: string[] = [];

            const theseFiles = files?.get(value);

            if (theseFiles) {
              for (const file of theseFiles) {
                if (file instanceof File) {
                  const storageId: string | null = await uploadFile?.(file);
                  if (storageId) {
                    storageIds.push(storageId);
                  }
                }
              }
            }
            if (storageIds.length > 0) {
              convertedVariables[key] = {
                value: storageIds
              };
            }
      } catch (error) {
        console.warn(`Failed to process file reference for key ${key}:`, value, error);
        convertedVariables[key] = {value: value};
      }
    } else {
      convertedVariables[key] = {value: value};
    }
  }
  console.log("convertedVariables", convertedVariables)
  return convertedVariables;
}

// Helper function to detect if a string looks like a date
function isDateString(str: string): boolean {
  // Check for patterns like "Sep 4, 2025, 2:18:51 AM" or other common date formats
  const datePatterns = [
    /^[A-Za-z]{3}\s+\d{1,2},\s+\d{4},\s+\d{1,2}:\d{2}:\d{2}\s+(AM|PM)$/i, // "Sep 4, 2025, 2:18:51 AM"
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // ISO-like formats
    /^\d{1,2}\/\d{1,2}\/\d{4}/, // MM/DD/YYYY
  ];

  return datePatterns.some(pattern => pattern.test(str));
}

// Helper function to detect ISO date strings
function isISODateString(str: string): boolean {
  // Match various ISO date formats:
  // 2025-09-05T03:06:00.000Z
  // 2025-09-05T03:06:00Z
  // 2025-09-05T03:06-06:00
  // 2025-09-05T03:06:00-06:00
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d{3})?(Z|[+-]\d{2}:\d{2})?$/i.test(str);
}



export default function FormViewer({ task, onTaskComplete}: FormViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<Form | null>(null);
  const [uploading, setUploading] = useState(false);
  const completeCamundaTask = useAction(api.actions.completeCamundaTask);
  const toggleTask = useMutation(api.internalAPI.tasks.toggleTask);
    const fetchCamundaFormSchema = useAction(api.actions.fetchCamundaFormSchema);
    const generateUploadUrl = useMutation(api.internalAPI.files.generateUploadUrl);
  // TODO: Add formOptions query once Convex regenerates API
  // const formSelectOptions = useQuery(api.formOptions.getFormSelectOptions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schema, setSchema] = useState<any | null>(null);


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

  const fetchFormSchema = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!task?.camundaId) {
        setError('No se pudo obtener el ID de la tarea de Camunda');
        return;
      }

      const result = await fetchCamundaFormSchema({
        camundaId: task.camundaId,
        variables: task.variables
      });

      if (result.success && result.data) {
        setSchema(result.data);
      } else {
        setError(result.error || 'Failed to fetch form schema from Camunda');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  


  // Fetch schema when task changes
  useEffect(() => {
    if (task?.camundaId) {
      fetchFormSchema();
    }
  }, [task?.camundaId]);

  // Initialize form when schema is available
  useEffect(() => {
    if (!containerRef.current || !schema) return;


      const form = new Form({
        container: containerRef.current
      });


      form.importSchema(schema, camundaToForm(task.variables)).catch(err => {
        console.error("Error importing schema", err);
        setError("Error loading form schema");
      });

      form.on("submit", async (event: any) => {
        setUploading(true);

    try {
      // Complete the Camunda task
      console.log("event data",event.data)
      const variables = await formToCamunda(event.data,event.files, uploadFile);
      

      console.log("aqui antes", variables);
      const result = await completeCamundaTask({
        camundaId: task.camundaId || "",
        variables: variables,
      });

      console.log("aqui despues")

      // Check if the Camunda API call was successful
      if (!result.success) {
        console.log(result)
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
      });

      formRef.current = form;

      return () => {
        form.destroy();
      };



  }, [schema, task.variables]);

  

  return (
    <div>
      <div
        ref={containerRef}
        className="fjs-container space-y-4 p-4 border rounded-xl bg-white shadow-sm"
      />
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button onClick={fetchFormSchema} variant="outline" type="button" className="cursor-pointer">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Recargar Formulario
                  </Button>
                  <Button
                    onClick={() => formRef.current?.submit()}
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
      
    </div>
  );
}
