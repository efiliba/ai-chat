"use client";

import { ThemeProvider } from "next-themes";

type ColorVariables = {
  background: string;
};

export function Theme({
  children,
  ...props
}: React.ComponentProps<typeof ThemeProvider> & ColorVariables) {
  return (
    <ThemeProvider {...props}>
      <div className={`[--background:${props.background}]`}>{children}</div>
    </ThemeProvider>
  );
}
