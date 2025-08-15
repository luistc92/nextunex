import React, { useState, useEffect } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface TagOption {
  label: string;
  value: string;
}

interface CamundaTaglistProps {
  id: string;
  camundaKey?: string;
  label?: string;
  description?: string;
  values?: TagOption[];
  valuesKey?: string;
  valuesExpression?: string;
  value?: string[];
  required?: boolean;
  disabled?: boolean;
  formData: Record<string, any>;
  onChange: (key: string, value: string[]) => void;
  className?: string;
}

export function CamundaTaglist({
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
}: CamundaTaglistProps) {
  const inputKey = camundaKey || id;
  const [options, setOptions] = useState<TagOption[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Simple JUEL expression evaluator
  const evaluateExpression = (expr: string, data: Record<string, any>): TagOption[] => {
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
      console.warn('Failed to evaluate taglist expression:', expr, error);
      return [];
    }
  };

  // Resolve options based on the source
  useEffect(() => {
    let resolvedOptions: TagOption[] = [];

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

  // Filter available options (exclude already selected)
  const availableOptions = options.filter(option =>
    !value.includes(option.value)
  );

  const handleUnselect = (optionValue: string) => {
    const newValue = value.filter(v => v !== optionValue);
    onChange(inputKey, newValue);
  };

  const handleSelect = (optionValue: string) => {
    if (!value.includes(optionValue)) {
      const newValue = [...value, optionValue];
      onChange(inputKey, newValue);
    }
    setInputValue("");
    setOpen(false);
  };

  const getTagLabel = (tagValue: string) => {
    const option = options.find(opt => opt.value === tagValue);
    return option ? option.label : tagValue;
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

      <Command className="overflow-visible bg-transparent">
        <div
          className={cn(
            "min-h-10 rounded-md border border-input text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            {
              "px-3 py-2": value.length !== 0,
              "cursor-text": !disabled && value.length !== 0,
            }
          )}
          onClick={() => {
            if (disabled) return;
            inputRef?.current?.focus();
          }}
        >
          <div className="relative flex flex-wrap gap-1">
            {value.map((tagValue, index) => (
              <Badge
                key={`${tagValue}_${index}`}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                <span>{getTagLabel(tagValue)}</span>
                {!disabled && (
                  <button
                    type="button"
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUnselect(tagValue);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(tagValue)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </Badge>
            ))}

            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              disabled={disabled}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={value.length === 0 ? "Seleccionar tags..." : ""}
              className={cn(
                "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
                {
                  "w-full": value.length === 0,
                  "px-3 py-2": value.length === 0,
                  "ml-1": value.length !== 0,
                }
              )}
            />
          </div>
        </div>

        <div className="relative">
          {open && availableOptions.length > 0 && (
            <CommandList className="absolute top-1 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in max-h-48 overflow-y-auto">
              <CommandEmpty>No hay opciones disponibles</CommandEmpty>
              <CommandGroup>
                {availableOptions.map((option, index) => (
                  <CommandItem
                    key={`${option.value}_${index}`}
                    value={option.label}
                    onMouseDown={(e: React.MouseEvent) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </div>
      </Command>

      {/* Empty state */}
      {options.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-2">
          No hay tags disponibles
        </p>
      )}

      {/* Validation */}
      {required && value.length === 0 && (
        <p className="text-sm text-red-500 mt-2">
          Debe seleccionar al menos un tag
        </p>
      )}
    </div>
  );
}
