import { ReactNode } from "react";
import type { Metadata } from "next";

import { Theme } from "@/components/Theme";

import "./globals.css";

export const metadata: Metadata = {
  title: "AI Chat",
  description: "Local DeepSeek-R1 Chat App",
};

// Get theme colours from db
const background = "purple";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      {/* <head>
        <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      </head> */}
      <body>
        <Theme
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          background={background}
        >
          {children}
        </Theme>
      </body>
    </html>
  );
}
