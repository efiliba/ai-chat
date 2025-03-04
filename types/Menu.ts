import { JSX } from "react";

export type MenuItem = {
  label: string;
  items: {
    icon: JSX.Element;
    label: string;
    serverAction: () => void;
  }[];
};
