import React, { useEffect } from "react";

interface CamundaExpressionProps {
  id: string;
  camundaKey?: string;
  expression: string;
  formData: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

export function CamundaExpression({
  id,
  camundaKey,
  expression,
  formData,
  onChange
}: CamundaExpressionProps) {
  const inputKey = camundaKey || id;

  // Simple JUEL expression evaluator
  const evaluateExpression = (expr: string, data: Record<string, any>): any => {
    try {
      // Remove the leading '=' if present
      const cleanExpr = expr.startsWith('=') ? expr.substring(1) : expr;
      
      // Create a safe evaluation context with form data
      const context = { ...data };
      
      // Simple expression evaluation for basic operations
      // This is a simplified implementation - in a real app you might want a proper JUEL parser
      let result = cleanExpr;
      
      // Replace variables with their values
      Object.keys(context).forEach(key => {
        const value = context[key];
        if (value !== undefined && value !== null) {
          // Replace variable references in the expression
          const regex = new RegExp(`\\b${key}\\b`, 'g');
          result = result.replace(regex, String(value));
        }
      });
      
      // Handle basic mathematical operations
      try {
        // Only evaluate if the result contains numbers and basic operators
        if (/^[\d\s+\-*/().]+$/.test(result)) {
          return eval(result);
        }
        
        // Handle string operations or return as-is
        return result;
      } catch (evalError) {
        console.warn('Expression evaluation failed:', evalError);
        return result;
      }
    } catch (error) {
      console.warn('Failed to evaluate expression:', expression, error);
      return null;
    }
  };

  // Effect to compute and update the expression value whenever form data changes
  useEffect(() => {
    const computedValue = evaluateExpression(expression, formData);
    
    // Only update if the computed value is different from current value
    if (formData[inputKey] !== computedValue) {
      onChange(inputKey, computedValue);
    }
  }, [formData, expression, inputKey, onChange]);

  // This component renders nothing - it's purely computational
  return null;
}
