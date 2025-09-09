import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface CamundaTextareaProps {
  id: string;
  camundaKey: string;
  label?: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  onChange: (camundaKey: string, value: string) => void;
  className?: string;
}

export function CamundaTextarea({
  id,
  camundaKey,
  label,
  placeholder,
  value = "",
  required = false,
  disabled = false,
  rows = 4,
  onChange,
  className = ""
}: CamundaTextareaProps) {
  if (!camundaKey) {
    throw new Error(`CamundaTextarea with id "${id}" is missing required camundaKey prop`);
  }

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Textarea
        value={value}
        onChange={(e) => onChange(camundaKey, e.target.value)}
        placeholder={placeholder || label}
        required={required}
        disabled={disabled}
        rows={rows}
        className="w-full"
      />
    </div>
  );
}
