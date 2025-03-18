"use client";

import { useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Color from "colorjs.io";

import { type ColorVariables, ColorContext } from "@/store/ColorContext";

const hslToString = ({ h, s, l }: { h: number; s: number; l: number }) =>
  new Color(new Color(Color.spaces.hsl, [h, s, l]))
    .to(Color.spaces.oklch)
    .display();

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
        {/* @ts-ignore */}
        <div style={{ "--background": hslToString(colors.background) }}>
          {children}
        </div>
      </ColorContext>
    </NextThemesProvider>
  );
};
