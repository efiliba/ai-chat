import { ReactNode } from "react";
import type { Metadata } from "next";
import { Settings } from "lucide-react";

import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui";

import "./globals.css";

export const metadata: Metadata = {
  title: "AI Chat",
  description: "Local DeepSeek-R1 Chat App",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="dark">
        <SidebarProvider defaultOpen={false}>
          <Sidebar collapsible="offcanvas" variant="inset" side="left">
            <SidebarHeader />
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Application</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="#">
                          <Settings />
                          <span>Settings</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
          </Sidebar>
          <SidebarInset>
            <SidebarTrigger />
            <main>{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
