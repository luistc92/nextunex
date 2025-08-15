import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface CamundaCheckboxProps {
  id: string;
  camundaKey?: string;
  label?: string;
  value?: boolean;
  required?: boolean;
  disabled?: boolean;
  onChange: (key: string, value: boolean) => void;
  className?: string;
}

export function CamundaCheckbox({
  id,
  camundaKey,
  label,
  value = false,
  required = false,
  disabled = false,
  onChange,
  className = ""
}: CamundaCheckboxProps) {


  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={value}
          onCheckedChange={(checked) => onChange(id, !!checked)}
          required={required}
          disabled={disabled}
        />
        {label && (
          <label 
            htmlFor={id}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>
    </div>
  );
}
