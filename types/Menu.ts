import { JSX } from "react";

export type MenuItem = {
  label: string;
  items: {
    icon?: JSX.Element;
    label?: string;
    component?: JSX.Element;
    disable?: boolean;
    serverAction?: () => void;
  }[];
};
