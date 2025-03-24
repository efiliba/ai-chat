import { createContext, Dispatch, SetStateAction } from "react";

export type ColorVariables = Record<
  string,
  { r: number; g: number; b: number }
>;

export const ColorContext = createContext<{
  colors: ColorVariables;
  setColors: Dispatch<SetStateAction<ColorVariables>>;
}>({
  colors: {
    "--background": { r: 255, g: 0, b: 0 },
    "--foreground": { r: 0, g: 0, b: 255 },
    "--primary": { r: 0, g: 255, b: 255 },
    "--primary-foreground": { r: 255, g: 128, b: 0 },
    "--secondary": { r: 66, g: 88, b: 255 },
    "--secondary-foreground": { r: 255, g: 255, b: 0 },
  },
  setColors: () => ({}),
});

// "--background": "#F00",
// "--foreground": "#00F",
// "--primary": "#0FF",
// "--primary-foreground": "rgb(255, 128, 0)",
// "--secondary": "#68F",
// "--secondary-foreground": "#FF0",
