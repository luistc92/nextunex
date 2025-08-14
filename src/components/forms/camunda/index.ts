// Camunda Form Components
export { CamundaText } from "./CamundaText";
export { CamundaTextfield } from "./CamundaTextfield";
export { CamundaTextarea } from "./CamundaTextarea";
export { CamundaCheckbox } from "./CamundaCheckbox";
export { CamundaFilepicker } from "./CamundaFilepicker";

// Component mapping for dynamic rendering
export const CAMUNDA_COMPONENT_MAP = {
  text: "CamundaText",
  textfield: "CamundaTextfield", 
  textarea: "CamundaTextarea",
  checkbox: "CamundaCheckbox",
  filepicker: "CamundaFilepicker"
} as const;

export type CamundaComponentType = keyof typeof CAMUNDA_COMPONENT_MAP;
