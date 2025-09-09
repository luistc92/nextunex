"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CamundaFormComponent {
  id: string;
  key?: string;
  label?: string;
  type: string;
  text?: string;
  description?: string;
  defaultValue?: any;
  decimalDigits?: number;
  increment?: string;
  disabled?: boolean;
  readonly?: string | boolean;
  // Datetime specific properties
  subtype?: "date" | "datetime" | "time";
  dateLabel?: string;
  disallowPassedDates?: boolean;
  // Expression specific properties
  expression?: string;
  computeOn?: string;
  // Filepicker specific properties
  multiple?: string | boolean;
  accept?: string;
  // Checklist and Select specific properties
  values?: Array<{ label: string; value: string }>;
  valuesKey?: string;
  valuesExpression?: string;
  // Select specific properties
  searchable?: boolean;
  appearance?: {
    prefixAdorner?: string;
    suffixAdorner?: string;
  };
  validate?: {
    required?: boolean;
    min?: string | number;
    max?: string | number;
  };
  layout: {
    row: string;
    columns: null | number;
  };
  // Group specific properties
  components?: CamundaFormComponent[];
  path?: string;
  showOutline?: boolean;
}

interface CamundaGroupProps {
  id: string;
  label?: string;
  components: CamundaFormComponent[];
  path?: string;
  showOutline?: boolean;
  formData: Record<string, any>;
  renderComponent: (component: CamundaFormComponent) => React.ReactNode;
}

export function CamundaGroup({
  id,
  label,
  components,
  path,
  showOutline = true,
  formData,
  renderComponent
}: CamundaGroupProps) {
  const groupContent = (
    <div className="space-y-4">
      {components.map((component) => renderComponent(component))}
    </div>
  );

  if (showOutline) {
    return (
      <Card key={id} className="w-full">
        {label && (
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              {label}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="pt-0">
          {groupContent}
        </CardContent>
      </Card>
    );
  }

  return (
    <div key={id} className="space-y-4">
      {label && (
        <h3 className="text-lg font-medium mb-3">
          {label}
        </h3>
      )}
      {groupContent}
    </div>
  );
}
