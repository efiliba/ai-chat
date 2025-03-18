"use client";

import { use } from "react";
import { type HslColor, HslColorPicker } from "react-colorful";

import { ColorContext } from "@/store/ColorContext";

export const ColorPicker = () => {
  const context = use(ColorContext);

  const handleColorChange = (hsl: HslColor) => {
    context.setColors({ background: hsl });
  };

  return (
    <HslColorPicker
      color={context.colors.background}
      onChange={handleColorChange}
    />
  );
};
