"use client";

import { ReactNode, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

import { mapColors, switchKeys } from "@/utils";
import { type ColorVariables, ColorContext } from "@/store/ColorContext";

const swopVariables = {
  "--background": "--foreground",
  "--primary": "--secondary",
  "--primary-foreground": "--secondary-foreground",
};

const mapColorsByTheme = (colors: ColorVariables, theme?: string) => {
  let mapped = mapColors(colors);

  if (theme === "dark") {
    return Object.entries(swopVariables).reduce((acc, [key1, key2]) => {
      mapped = switchKeys(mapped, key1, key2);
      return {
        ...acc,
        ...mapped,
      };
    }, {});
  }

  return mapped;
};

const ColorProvider = ({ children }: { children: ReactNode }) => {
  const { resolvedTheme } = useTheme();

  const [colors, setColors] = useState<ColorVariables>({});

  return (
    <ColorContext value={{ colors, setColors }}>
      <div style={mapColorsByTheme(colors, resolvedTheme)}>{children}</div>
    </ColorContext>
  );
};

export const ThemeProvider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  return (
    <NextThemesProvider {...props}>
      <ColorProvider>{children}</ColorProvider>
    </NextThemesProvider>
  );
};
