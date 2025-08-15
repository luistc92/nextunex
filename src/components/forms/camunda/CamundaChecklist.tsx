import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface ChecklistOption {
  label: string;
  value: string;
}

interface CamundaChecklistProps {
  id: string;
  camundaKey?: string;
  label?: string;
  description?: string;
  values?: ChecklistOption[];
  valuesKey?: string;
  valuesExpression?: string;
  value?: string[];
  required?: boolean;
  disabled?: boolean;
  formData: Record<string, any>;
  onChange: (key: string, value: string[]) => void;
  className?: string;
}

export function CamundaChecklist({
  id,
  camundaKey,
  label,
  description,
  values,
  valuesKey,
  valuesExpression,
  value = [],
  required = false,
  disabled = false,
  formData,
  onChange,
  className = ""
}: CamundaChecklistProps) {
  const inputKey = camundaKey || id;
  const [options, setOptions] = useState<ChecklistOption[]>([]);

  // Simple JUEL expression evaluator (similar to CamundaExpression)
  const evaluateExpression = (expr: string, data: Record<string, any>): ChecklistOption[] => {
    try {
      const cleanExpr = expr.startsWith('=') ? expr.substring(1) : expr;
      let result = cleanExpr;
      
      // Replace variables with their values
      Object.keys(data).forEach(key => {
        const value = data[key];
        if (value !== undefined && value !== null) {
          const regex = new RegExp(`\\b${key}\\b`, 'g');
          result = result.replace(regex, JSON.stringify(value));
        }
      });
      
      // Try to evaluate as JSON array
      try {
        const evaluated = eval(`(${result})`);
        if (Array.isArray(evaluated)) {
          return evaluated.map((item, index) => ({
            label: item.label || item.toString(),
            value: item.value || item.toString() || `option_${index}`
          }));
        }
      } catch (evalError) {
        console.warn('Expression evaluation failed:', evalError);
      }
      
      return [];
    } catch (error) {
      console.warn('Failed to evaluate checklist expression:', expr, error);
      return [];
    }
  };

  // Resolve options based on the source
  useEffect(() => {
    let resolvedOptions: ChecklistOption[] = [];

    if (values && Array.isArray(values)) {
      // Static values
      resolvedOptions = values;
    } else if (valuesKey && formData[valuesKey]) {
      // Values from form data variable
      const variableValue = formData[valuesKey];
      if (Array.isArray(variableValue)) {
        resolvedOptions = variableValue.map((item, index) => ({
          label: item.label || item.toString(),
          value: item.value || item.toString() || `option_${index}`
        }));
      }
    } else if (valuesExpression) {
      // Values from JUEL expression
      resolvedOptions = evaluateExpression(valuesExpression, formData);
    }

    setOptions(resolvedOptions);
  }, [values, valuesKey, valuesExpression, formData]);

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    const currentValues = value || [];
    let newValues: string[];

    if (checked) {
      // Add value if not already present
      newValues = currentValues.includes(optionValue) 
        ? currentValues 
        : [...currentValues, optionValue];
    } else {
      // Remove value
      newValues = currentValues.filter(v => v !== optionValue);
    }

    onChange(inputKey, newValues);
  };

  const isChecked = (optionValue: string) => {
    return (value || []).includes(optionValue);
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
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {description}
        </p>
      )}

      <div className="space-y-3">
        {options.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            No hay opciones disponibles
          </p>
        ) : (
          options.map((option, index) => (
            <div key={`${option.value}_${index}`} className="flex items-center space-x-3">
              <Checkbox
                id={`${inputKey}_${option.value}_${index}`}
                checked={isChecked(option.value)}
                onCheckedChange={(checked) => handleCheckboxChange(option.value, checked as boolean)}
                disabled={disabled}
                className="cursor-pointer"
              />
              <label 
                htmlFor={`${inputKey}_${option.value}_${index}`}
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex-1"
              >
                {option.label}
              </label>
            </div>
          ))
        )}
      </div>

      {required && (!value || value.length === 0) && (
        <p className="text-sm text-red-500 mt-2">
          Debe seleccionar al menos una opción
        </p>
      )}
    </div>
  );
}
