import { type ColorVariables } from "@/store/ColorContext";

// const hslToOklchString = ({ h, s, l }: { h: number; s: number; l: number }) =>
//   new Color(new Color(Color.spaces.hsl, [h, s, l]))
//     .to(Color.spaces.oklch)
//     .display();

// const hslToString = ({ h, s, l }: { h: number; s: number; l: number }) =>
//   `oklch(from hsl(${h} ${s} ${l}) l c h)`;

export const mapColors = (colors: ColorVariables) =>
  Object.entries(colors).reduce(
    (acc, [key, { r, g, b }]) => ({ ...acc, [key]: `rgb(${r} ${g} ${b})` }),
    {}
  );
