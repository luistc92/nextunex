import React, { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioOption {
  label: string;
  value: string;
}

interface CamundaRadioProps {
  id: string;
  camundaKey?: string;
  label?: string;
  description?: string;
  values?: RadioOption[];
  valuesKey?: string;
  valuesExpression?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  formData: Record<string, any>;
  onChange: (key: string, value: string) => void;
  className?: string;
}

export function CamundaRadio({
  id,
  camundaKey,
  label,
  description,
  values,
  valuesKey,
  valuesExpression,
  value = "",
  required = false,
  disabled = false,
  formData,
  onChange,
  className = ""
}: CamundaRadioProps) {
  const inputKey = camundaKey || id;
  const [options, setOptions] = useState<RadioOption[]>([]);

  // Simple JUEL expression evaluator (similar to CamundaExpression)
  const evaluateExpression = (expr: string, data: Record<string, any>): RadioOption[] => {
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
      console.warn('Failed to evaluate radio expression:', expr, error);
      return [];
    }
  };

  // Resolve options based on the source
  useEffect(() => {
    let resolvedOptions: RadioOption[] = [];

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

  const handleValueChange = (selectedValue: string) => {
    onChange(inputKey, selectedValue);
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

      {options.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          No hay opciones disponibles
        </p>
      ) : (
        <RadioGroup
          value={value}
          onValueChange={handleValueChange}
          disabled={disabled}
          className="space-y-3"
        >
          {options.map((option, index) => (
            <div key={`${option.value}_${index}`} className="flex items-center space-x-3">
              <RadioGroupItem
                value={option.value}
                id={`${inputKey}_${option.value}_${index}`}
                className="cursor-pointer"
              />
              <Label 
                htmlFor={`${inputKey}_${option.value}_${index}`}
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex-1"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {required && !value && (
        <p className="text-sm text-red-500 mt-2">
          Debe seleccionar una opción
        </p>
      )}
    </div>
  );
}
