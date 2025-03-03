"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui";

export const ThemeToggle = () => {
  const { setTheme } = useTheme();

  const handleThemeChange = () =>
    setTheme((theme) => (theme === "dark" ? "light" : "dark"));

  return (
    <Button
      className="cursor-pointer"
      variant="outline"
      size="icon"
      onClick={handleThemeChange}
    >
      <Sun className="absolute h-[1.2rem] w-[1.2rem] scale-0 dark:scale-100" />
      <Moon className="h-[1.2rem] w-[1.2rem] scale-100 dark:scale-0" />
    </Button>
  );
};
