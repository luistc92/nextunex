"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface Task {
  _id: string;
  type: "subirReporteMovimientos";
  isCompleted: boolean;
  createdAt: number;
  asignee?: string;
  variables?: any;
}

interface SubirReporteMovimientosFormProps {
  task: Task;
  onTaskComplete?: () => void;
}

export function SubirReporteMovimientosForm({ task, onTaskComplete }: SubirReporteMovimientosFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [comments, setComments] = useState("");
  
  const toggleTask = useMutation(api.internalAPI.tasks.toggleTask);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (Excel files)
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        alert('Por favor selecciona un archivo Excel (.xlsx, .xls) o CSV (.csv)');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Por favor selecciona un archivo');
      return;
    }

    setUploading(true);
    
    try {
      // Simulate file upload (in a real app, you'd upload to a file storage service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark task as completed
      await toggleTask({ id: task._id });
      
      // Reset form
      setSelectedFile(null);
      setComments("");
      
      // Notify parent component
      onTaskComplete?.();
      
      alert('Reporte subido exitosamente');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error al subir el archivo. Por favor intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (task.isCompleted) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Tarea Completada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Esta tarea fue completada exitosamente.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Completada el: {formatDate(task.createdAt)}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Subir Reporte de Movimientos
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sube el archivo Excel con el reporte de movimientos del período correspondiente.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Info */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Información de la Tarea
              </h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Creada: {formatDate(task.createdAt)}</p>
                {task.asignee && <p>Asignado por: {task.asignee}</p>}
                {task.variables && (
                  <p>Variables: {JSON.stringify(task.variables, null, 2)}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Archivo de Reporte *
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Haz clic para seleccionar un archivo Excel o CSV
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Formatos soportados: .xlsx, .xls, .csv
                  </p>
                </label>
              </div>
              
              {selectedFile && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-blue-600 mr-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comentarios (Opcional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Agrega cualquier comentario o nota sobre este reporte..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button
                type="submit"
                disabled={!selectedFile || uploading}
                className="flex items-center"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Reporte
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
