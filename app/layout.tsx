import { ReactNode } from "react";
import type { Metadata } from "next";

import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui";
import { SidebarPanel } from "@/components/SidebarPanel";

import "./globals.css";

export const metadata: Metadata = {
  title: "AI Chat",
  description: "Local DeepSeek-R1 Chat App",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={false}>
            <SidebarPanel />
            <SidebarTrigger className="sticky top-0 cursor-pointer" />
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
