import React from "react";
import { Upload, X } from "lucide-react";

interface CamundaFilepickerProps {
  id: string;
  camundaKey?: string;
  label?: string;
  value?: File | File[] | null;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onChange: (id: string, value: File | File[] | null) => void;
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
  const inputKey = camundaKey || id;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      onChange(inputKey, null);
      return;
    }

    // Check file sizes
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && maxSize && file.size > maxSize * 1024 * 1024) {
        alert(`El archivo "${file.name}" es demasiado grande. Tamaño máximo: ${maxSize}MB`);
        return;
      }
    }

    if (multiple) {
      onChange(inputKey, Array.from(files));
    } else {
      const firstFile = files[0];
      onChange(inputKey, firstFile || null);
    }
  };

  const removeFile = (indexToRemove: number) => {
    if (multiple && Array.isArray(value)) {
      const newFiles = value.filter((_, index) => index !== indexToRemove);
      onChange(inputKey, newFiles.length > 0 ? newFiles : null);
    } else {
      onChange(inputKey, null);
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
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
        <input
          type="file"
          id={inputKey}
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          required={required}
          disabled={disabled}
        />
        <label htmlFor={inputKey} className={`cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}>
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getDisplayText()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {getAcceptText()} {multiple ? "(múltiples archivos)" : ""} (máx. {maxSize}MB)
          </p>
        </label>
      </div>

      {/* Selected Files List */}
      {value && Array.isArray(value) && value.length > 0 && (
        <div className="mt-3 space-y-2">
          {value.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
