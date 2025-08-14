import React from "react";
import { Input } from "@/components/ui/input";

interface CamundaTextfieldProps {
  id: string;
  camundaKey?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (key: string, value: string) => void;
  className?: string;
}

export function CamundaTextfield({
  id,
  camundaKey,
  label,
  placeholder,
  value = "",
  required = false,
  disabled = false,
  onChange,
  className = ""
}: CamundaTextfieldProps) {
  const inputKey = camundaKey || id;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Input
        value={value}
        onChange={(e) => onChange(inputKey, e.target.value)}
        placeholder={placeholder || label}
        required={required}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
}
