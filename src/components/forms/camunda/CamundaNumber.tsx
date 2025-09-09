import React from "react";
import { Input } from "@/components/ui/input";

interface CamundaNumberProps {
  id: string;
  camundaKey: string;
  label?: string;
  description?: string;
  value?: number;
  defaultValue?: number;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  min?: number;
  max?: number;
  step?: number;
  decimalDigits?: number;
  prefixAdorner?: string;
  suffixAdorner?: string;
  onChange: (camundaKey: string, value: number) => void;
  className?: string;
}

export function CamundaNumber({
  id,
  camundaKey,
  label,
  description,
  value,
  defaultValue,
  required = false,
  disabled = false,
  readonly = false,
  min,
  max,
  step,
  decimalDigits,
  prefixAdorner,
  suffixAdorner,
  onChange,
  className = ""
}: CamundaNumberProps) {
  if (!camundaKey) {
    throw new Error(`CamundaNumber with id "${id}" is missing required camundaKey prop`);
  }
  const currentValue = value ?? defaultValue ?? 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(camundaKey, newValue);
    } else if (e.target.value === "") {
      onChange(camundaKey, 0);
    }
  };

  // Format the step based on decimal digits
  const formatStep = () => {
    if (step !== undefined) return step;
    if (decimalDigits !== undefined && decimalDigits > 0) {
      return 1 / Math.pow(10, decimalDigits);
    }
    return 1;
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {description}
        </p>
      )}

      <div className="relative">
        {prefixAdorner && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 pointer-events-none">
            {prefixAdorner}
          </div>
        )}
        
        <Input
          type="number"
          value={currentValue}
          onChange={handleChange}
          min={min}
          max={max}
          step={formatStep()}
          required={required}
          disabled={disabled}
          readOnly={readonly}
          className={`w-full ${prefixAdorner ? 'pl-12' : ''} ${suffixAdorner ? 'pr-12' : ''}`}
        />
        
        {suffixAdorner && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 pointer-events-none">
            {suffixAdorner}
          </div>
        )}
      </div>

      {/* Validation error display */}
      {min !== undefined && max !== undefined && (currentValue < min || currentValue > max) && (
        <p className="text-sm text-red-500 mt-1">
          Please select a valid value, the two nearest valid values are {min} and {max}.
        </p>
      )}
    </div>
  );
}
