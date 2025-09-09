// Camunda Form Components
export { CamundaText } from "./CamundaText";
export { CamundaTextfield } from "./CamundaTextfield";
export { CamundaTextarea } from "./CamundaTextarea";
export { CamundaCheckbox } from "./CamundaCheckbox";
export { CamundaFilepicker } from "./CamundaFilepicker";
export { CamundaNumber } from "./CamundaNumber";
export { CamundaDatetime } from "./CamundaDatetime";
export { CamundaExpression } from "./CamundaExpression";
export { CamundaChecklist } from "./CamundaChecklist";
export { CamundaRadio } from "./CamundaRadio";
export { CamundaSelect } from "./CamundaSelect";
export { CamundaTaglist } from "./CamundaTaglist";
export { CamundaGroup } from "./CamundaGroup";

// Component mapping for dynamic rendering
export const CAMUNDA_COMPONENT_MAP = {
  text: "CamundaText",
  textfield: "CamundaTextfield",
  textarea: "CamundaTextarea",
  checkbox: "CamundaCheckbox",
  filepicker: "CamundaFilepicker",
  number: "CamundaNumber",
  datetime: "CamundaDatetime",
  expression: "CamundaExpression",
  checklist: "CamundaChecklist",
  radio: "CamundaRadio",
  select: "CamundaSelect",
  taglist: "CamundaTaglist",
  group: "CamundaGroup",
  dynamiclist: "CamundaDynamicList"
} as const;

export type CamundaComponentType = keyof typeof CAMUNDA_COMPONENT_MAP;
