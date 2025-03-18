import { createContext } from "react";

import { type HslColor } from "react-colorful";

export type ColorVariables = {
  background: HslColor;
};

export const ColorContext = createContext<{
  colors: ColorVariables;
  setColors: ({ background }: { background: HslColor }) => void;
}>({
  colors: {
    background: { h: 0, s: 0, l: 0 },
  },
  setColors: () => {},
});
