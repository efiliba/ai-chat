"use client";

import { use } from "react";
import { type HslColor, HslColorPicker } from "react-colorful";

import { ColorContext } from "@/store/ColorContext";

export const ColorPicker = () => {
  const { colors, setColors } = use(ColorContext);

  const handleColorChange = (hsl: HslColor) => {
    setColors({ background: hsl });
  };

  return (
    <HslColorPicker color={colors.background} onChange={handleColorChange} />
  );
};
