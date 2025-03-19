import { createContext, Dispatch, SetStateAction } from "react";

export type ColorVariables = Record<
  string,
  { r: number; g: number; b: number }
>;

export const ColorContext = createContext<{
  colors: ColorVariables;
  setColors: Dispatch<SetStateAction<ColorVariables>>;
}>({
  colors: {},
  setColors: () => ({}),
});
