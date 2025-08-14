import React from "react";

interface CamundaTextProps {
  id: string;
  text?: string;
  className?: string;
}

export function CamundaText({ text, className = "" }: CamundaTextProps) {
  if (!text) return null;

  // Parse markdown-style headers
  if (text.startsWith("# ")) {
    return (
      <h1 className={`text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 ${className}`}>
        {text.substring(2)}
      </h1>
    );
  }

  if (text.startsWith("## ")) {
    return (
      <h2 className={`text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 ${className}`}>
        {text.substring(3)}
      </h2>
    );
  }

  if (text.startsWith("### ")) {
    return (
      <h3 className={`text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 ${className}`}>
        {text.substring(4)}
      </h3>
    );
  }

  // Regular text
  return (
    <p className={`text-gray-700 dark:text-gray-300 mb-4 ${className}`}>
      {text}
    </p>
  );
}
