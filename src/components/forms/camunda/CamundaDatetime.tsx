import React from "react";
import { Input } from "@/components/ui/input";

interface CamundaDatetimeProps {
  id: string;
  camundaKey?: string;
  label?: string;
  dateLabel?: string;
  description?: string;
  subtype: "date" | "datetime" | "time";
  value?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  disallowPassedDates?: boolean;
  onChange: (key: string, value: string) => void;
  className?: string;
}

export function CamundaDatetime({
  id,
  camundaKey,
  label,
  dateLabel,
  description,
  subtype,
  value = "",
  required = false,
  disabled = false,
  readonly = false,
  disallowPassedDates = false,
  onChange,
  className = ""
}: CamundaDatetimeProps) {
  const inputKey = camundaKey || id;
  const displayLabel = dateLabel || label;

  // Determine the input type based on subtype
  const getInputType = () => {
    switch (subtype) {
      case "date":
        return "date";
      case "datetime":
        return "datetime-local";
      case "time":
        return "time";
      default:
        return "date";
    }
  };

  // Get minimum date if disallowPassedDates is true
  const getMinDate = () => {
    if (!disallowPassedDates) return undefined;
    
    const today = new Date();
    switch (subtype) {
      case "date":
        return today.toISOString().split('T')[0];
      case "datetime":
        return today.toISOString().slice(0, 16);
      case "time":
        return undefined; // Time doesn't have past/future concept
      default:
        return undefined;
    }
  };

  // Format placeholder based on subtype
  const getPlaceholder = () => {
    switch (subtype) {
      case "date":
        return "Seleccionar fecha";
      case "datetime":
        return "Seleccionar fecha y hora";
      case "time":
        return "Seleccionar hora";
      default:
        return "Seleccionar";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(inputKey, e.target.value);
  };

  return (
    <div className={`mb-4 ${className}`}>
      {displayLabel && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {displayLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {description}
        </p>
      )}

      <Input
        type={getInputType()}
        value={value}
        onChange={handleChange}
        min={getMinDate()}
        placeholder={getPlaceholder()}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        className="w-full"
      />

      {disallowPassedDates && subtype !== "time" && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          No se permiten fechas pasadas
        </p>
      )}
    </div>
  );
}
