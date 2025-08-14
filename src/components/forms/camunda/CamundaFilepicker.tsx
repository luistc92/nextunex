import React from "react";
import { Upload } from "lucide-react";

interface CamundaFilepickerProps {
  id: string;
  camundaKey?: string;
  label?: string;
  value?: File | null;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  onChange: (key: string, value: File | null) => void;
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
  maxSize = 10,
  onChange,
  className = ""
}: CamundaFilepickerProps) {
  const inputKey = camundaKey || id;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file && maxSize && file.size > maxSize * 1024 * 1024) {
      alert(`El archivo es demasiado grande. Tamaño máximo: ${maxSize}MB`);
      return;
    }
    
    onChange(inputKey, file);
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
        <input
          type="file"
          id={inputKey}
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          required={required}
          disabled={disabled}
        />
        <label htmlFor={inputKey} className={`cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}>
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {value ? value.name : "Haz clic para seleccionar un archivo"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {accept.replace(/\./g, '').toUpperCase()} (máx. {maxSize}MB)
          </p>
        </label>
      </div>
    </div>
  );
}
