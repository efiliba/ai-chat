import { MenuItem } from "@/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui";

export const SidebarPanel = ({
  className,
  menuItems,
}: {
  className?: string;
  menuItems: MenuItem[];
}) => (
  <Sidebar className={className}>
    <SidebarHeader />
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Theme</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <ThemeToggle />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {menuItems.map(({ label, items }, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel>{label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(
                (
                  { icon, label, component, disable, serverAction },
                  itemIndex
                ) => (
                  <SidebarMenuItem key={itemIndex}>
                    {component ?? (
                      <SidebarMenuButton
                        className="cursor-pointer"
                        disabled={disable}
                        onClick={serverAction}
                      >
                        {icon}
                        <span>{label}</span>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
    <SidebarFooter />
  </Sidebar>
);
