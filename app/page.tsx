import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { MessageSquareX } from "lucide-react";

import { chatHistoryAction, clearChatAction } from "@/server";
import { SidebarPanel } from "@/components/SidebarPanel";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui";
import { ColorPicker } from "@/components/ColorPicker";
import { AIChat } from "@/components/AIChat";

export default async function Home() {
  const cookieStore = await cookies();
  const open = cookieStore.get("sidebar_state")?.value === "true";

  const id = "1";

  const initialHistory = await chatHistoryAction(id);

  const sidebarMenuItems = [
    {
      label: "Application",
      items: [
        {
          icon: <MessageSquareX />,
          label: "Delete Chat History",
          disable: initialHistory.length === 0,
          serverAction: async () => {
            "use server";

            await clearChatAction(id);
            revalidatePath("/");
          },
        },
        {
          component: <ColorPicker />,
        },
      ],
    },
  ];

  return (
    <SidebarProvider defaultOpen={open}>
      <SidebarPanel
        className="shadow-lg shadow-primary"
        menuItems={sidebarMenuItems}
      />
      <SidebarTrigger className="sticky top-0 cursor-pointer" />
      <SidebarInset>
        <AIChat id={id} initialHistory={initialHistory} />
      </SidebarInset>
    </SidebarProvider>
  );
}
