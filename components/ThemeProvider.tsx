"use client";

import { useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { type ColorVariables, ColorContext } from "@/store/ColorContext";
import { type HslColor } from "react-colorful";

// Use '_' separator for Tailwind
const hslToString = ({ h, s, l }: HslColor, separator = " ") =>
  `${h}${separator}${s}%${separator}${l}%`;

export const ThemeProvider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  const [colors, setColors] = useState<ColorVariables>({
    background: { h: 0, s: 50, l: 50 },
  });

  return (
    <NextThemesProvider {...props}>
      <ColorContext value={{ colors, setColors }}>
        <div
          style={{ "--background": `hsl(${hslToString(colors.background)})` }}
        >
          {children}
        </div>
      </ColorContext>
    </NextThemesProvider>
  );
};
