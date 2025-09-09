import React, { useState, useEffect } from "react";
import { Upload, X, FileText, Image, File, CheckCircle2 } from "lucide-react";

interface CamundaFilepickerProps {
  id: string;
  camundaKey: string;
  label?: string;
  value?: File | File[] | null;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onChange: (camundaKey: string, value: File | File[] | null) => void;
  className?: string;
}

export function CamundaFilepicker({
  id,
  camundaKey,
  label,
  value = null,
  required = false,
  disabled = false,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png",
  multiple = false,
  maxSize = 10,
  onChange,
  className = ""
}: CamundaFilepickerProps) {
  if (!camundaKey) {
    throw new Error(`CamundaFilepicker with id "${id}" is missing required camundaKey prop`);
  }
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});

  // Helper function to get file type icon
  const getFileIcon = (file: File) => {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    if (fileType.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes('word') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      return <FileText className="h-5 w-5 text-blue-600" />;
    } else if (fileType.includes('excel') || fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      return <FileText className="h-5 w-5 text-green-600" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  // Helper function to check if file is an image
  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };

  // Generate image previews
  useEffect(() => {
    const generatePreviews = async () => {
      const previews: Record<string, string> = {};

      if (value) {
        const files = Array.isArray(value) ? value : [value];

        for (const file of files) {
          if (isImageFile(file)) {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                previews[file.name] = e.target.result as string;
                setImagePreviews(prev => ({ ...prev, [file.name]: e.target!.result as string }));
              }
            };
            reader.readAsDataURL(file);
          }
        }
      } else {
        setImagePreviews({});
      }
    };

    generatePreviews();
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      onChange(camundaKey, null);
      return;
    }

    // Check file sizes
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && maxSize && file.size > maxSize * 1024 * 1024) {
        alert(`El archivo "${file.name}" es demasiado grande. Tamaño máximo: ${maxSize}MB`);
        // Reset the input value to allow re-selection
        e.target.value = '';
        return;
      }
    }

    if (multiple) {
      const newFiles = Array.from(files);
      // If there are existing files, add the new ones to the existing array
      if (value && Array.isArray(value)) {
        const combinedFiles = [...value, ...newFiles];
        onChange(camundaKey, combinedFiles);
      } else {
        onChange(camundaKey, newFiles);
      }
    } else {
      const firstFile = files[0];
      onChange(camundaKey, firstFile || null);
    }

    // Reset the input value to allow re-selection of the same file
    e.target.value = '';
  };

  const removeFile = (indexToRemove: number) => {
    if (multiple && Array.isArray(value)) {
      const newFiles = value.filter((_, index) => index !== indexToRemove);
      onChange(camundaKey, newFiles.length > 0 ? newFiles : null);
    } else {
      onChange(camundaKey, null);
    }
  };

  const getDisplayText = () => {
    if (!value) {
      return multiple ? "Haz clic para seleccionar archivos" : "Haz clic para seleccionar un archivo";
    }

    if (Array.isArray(value)) {
      return `${value.length} archivo${value.length !== 1 ? 's' : ''} seleccionado${value.length !== 1 ? 's' : ''}`;
    }

    return value.name;
  };

  const getAcceptText = () => {
    if (!accept) return "";
    return accept.replace(/\./g, '').toUpperCase();
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* File Input */}
      {!value ? (
        // Empty state - show upload area
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
          <input
            type="file"
            id={camundaKey}
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
            multiple={multiple}
            required={required}
            disabled={disabled}
          />
          <label htmlFor={camundaKey} className={`cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}>
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getDisplayText()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {getAcceptText()} {multiple ? "(múltiples archivos)" : ""} (máx. {maxSize}MB)
            </p>
          </label>
        </div>
      ) : (
        // Files selected state - show prominent file display
        <div className="space-y-3">
          {/* Success indicator */}
          <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">
              {Array.isArray(value) ? `${value.length} archivo${value.length !== 1 ? 's' : ''} seleccionado${value.length !== 1 ? 's' : ''}` : 'Archivo seleccionado'}
            </span>
          </div>

          {/* File preview area */}
          <div className="border-2 border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
            {Array.isArray(value) ? (
              // Multiple files
              <div className="space-y-3">
                {value.map((file, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
                    {/* File icon or image preview */}
                    <div className="flex-shrink-0">
                      {isImageFile(file) && imagePreviews[file.name] ? (
                        <img
                          src={imagePreviews[file.name]}
                          alt={file.name}
                          className="h-12 w-12 object-cover rounded border"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded border flex items-center justify-center">
                          {getFileIcon(file)}
                        </div>
                      )}
                    </div>

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 cursor-pointer flex-shrink-0"
                      disabled={disabled}
                      title="Eliminar archivo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              // Single file
              <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                {/* File icon or image preview */}
                <div className="flex-shrink-0">
                  {isImageFile(value) && imagePreviews[value.name] ? (
                    <img
                      src={imagePreviews[value.name]}
                      alt={value.name}
                      className="h-16 w-16 object-cover rounded border"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded border flex items-center justify-center">
                      {getFileIcon(value)}
                    </div>
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                    {value.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(value.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ Archivo listo para enviar
                  </p>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFile(0)}
                  className="text-red-500 hover:text-red-700 cursor-pointer flex-shrink-0"
                  disabled={disabled}
                  title="Eliminar archivo"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Add more files button (for multiple mode) or change file button */}
          <div className="text-center">
            <input
              type="file"
              id={`${camundaKey}-additional`}
              className="hidden"
              onChange={handleFileChange}
              accept={accept}
              multiple={multiple}
              disabled={disabled}
            />
            <label
              htmlFor={`${camundaKey}-additional`}
              className={`inline-flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <Upload className="h-4 w-4" />
              <span>{multiple ? "Agregar más archivos" : "Cambiar archivo"}</span>
            </label>
          </div>
        </div>
      )}


    </div>
  );
}
