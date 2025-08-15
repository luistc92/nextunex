import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";

interface SelectOption {
  label: string;
  value: string;
}

interface CamundaSelectProps {
  id: string;
  camundaKey?: string;
  label?: string;
  description?: string;
  values?: SelectOption[];
  valuesKey?: string;
  valuesExpression?: string;
  value?: string;
  defaultValue?: string;
  searchable?: boolean;
  required?: boolean;
  disabled?: boolean;
  formData: Record<string, any>;
  onChange: (key: string, value: string) => void;
  className?: string;
}

export function CamundaSelect({
  id,
  camundaKey,
  label,
  description,
  values,
  valuesKey,
  valuesExpression,
  value,
  defaultValue,
  searchable = false,
  required = false,
  disabled = false,
  formData,
  onChange,
  className = ""
}: CamundaSelectProps) {
  const inputKey = camundaKey || id;
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Use defaultValue if no value is set
  const currentValue = value || defaultValue || "";

  // Simple JUEL expression evaluator
  const evaluateExpression = (expr: string, data: Record<string, any>): SelectOption[] => {
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
      console.warn('Failed to evaluate select expression:', expr, error);
      return [];
    }
  };

  // Resolve options based on the source
  useEffect(() => {
    let resolvedOptions: SelectOption[] = [];

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

  // Set default value when options are loaded
  useEffect(() => {
    if (defaultValue && !value && options.length > 0) {
      const defaultOption = options.find(opt => opt.value === defaultValue);
      if (defaultOption) {
        onChange(inputKey, defaultValue);
      }
    }
  }, [defaultValue, value, options, inputKey, onChange]);

  const handleValueChange = (selectedValue: string) => {
    onChange(inputKey, selectedValue);
  };

  // Filter options based on search term
  const filteredOptions = searchable && searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Get display label for selected value
  const getSelectedLabel = () => {
    const selectedOption = options.find(opt => opt.value === currentValue);
    return selectedOption ? selectedOption.label : "";
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
        <div className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            No hay opciones disponibles
          </p>
        </div>
      ) : (
        <Select
          value={currentValue}
          onValueChange={handleValueChange}
          disabled={disabled}
          onOpenChange={setIsOpen}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Seleccionar opción">
              {getSelectedLabel()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            )}
            {filteredOptions.length === 0 ? (
              <div className="p-2 text-sm text-gray-500 dark:text-gray-400 italic">
                {searchable && searchTerm ? "No se encontraron resultados" : "No hay opciones"}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <SelectItem
                  key={`${option.value}_${index}`}
                  value={option.value}
                  className="cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}

      {required && !currentValue && (
        <p className="text-sm text-red-500 mt-2">
          Debe seleccionar una opción
        </p>
      )}
    </div>
  );
}
