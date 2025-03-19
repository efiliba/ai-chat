"use client";

import { use } from "react";
import { type RgbColor, RgbColorPicker } from "react-colorful";

import { type ColorVariables, ColorContext } from "@/store/ColorContext";

export const ColorPicker = ({ variable }: { variable: string }) => {
  const { colors, setColors } = use(ColorContext);

  const handleColorChange = (color: RgbColor) => {
    setColors((variables: ColorVariables) => ({
      ...variables,
      [variable]: color,
    }));
  };

  return (
    <RgbColorPicker color={colors[variable]} onChange={handleColorChange} />
  );
};
