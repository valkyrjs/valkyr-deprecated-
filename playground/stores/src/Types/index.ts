export type Principal = {
  entity: string;
  key: string;
};

export type ComponentKind =
  | "label"
  | "list"
  | "input"
  | "toggle"
  | "select"
  | "textarea"
  | "color"
  | "image"
  | "video"
  | "datepicker"
  | "button"
  | "panel";

export type Size = {
  w: number;
  h: number;
};

export type Position = {
  x: number;
  y: number;
};

export type Layout = Size & Position;

export type Layouts = {
  desktop: Layout;
};

export type BorderColor = string;
export type TextColor = string;
export type BgColor = string;

export type BorderWidth = 0 | 1 | 2 | 3 | 4;

export type BorderStyle = {
  width: BorderWidth;
};

export type Border = {
  color: BorderColor;
  top: BorderStyle;
  right: BorderStyle;
  bottom: BorderStyle;
  left: BorderStyle;
};

export type LabelComponentSettings = {
  text: string;
  color: string;
  background: string;
  border: string;
};

export type ButtonComponentSettings = {
  text: string;
  color: string;
  background: string;
  border: string;
  actionType: "navigate" | "action";
  action: string;
};

export type ListComponentSettings = {
  name: string;
  background: string;
  border: Border;
  direction: "flex-col" | "flex-row";
  alignment: "items-start" | "items-center" | "items-end";
  justify: "justify-start" | "justify-center" | "justify-end";
  cardSize: "compact" | "card";
  actions: boolean;
};

export type InputComponentSettings = {
  label: string;
  type: "text" | "number" | "email";
  placeholder: string;
  defaultValue: string;
  required: boolean;
  background: BgColor;
  border: Border;
};

export type SelectComponentSettings = {
  label: string;
  placeholder: string;
  defaultValue: string;
  required: boolean;
  options: { name: string; value: string }[];
  background: BgColor;
  border: Border;
};

export type ComponentSettings = LabelComponentSettings &
  ListComponentSettings &
  InputComponentSettings &
  ButtonComponentSettings &
  SelectComponentSettings;

export type Component = {
  id: string;
  principal: Principal;
  kind: ComponentKind;
  data: any;
};
