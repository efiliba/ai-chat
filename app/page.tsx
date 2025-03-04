import { MessageSquareX } from "lucide-react";
import { revalidatePath } from "next/cache";

import { chatHistoryAction, clearChatAction } from "@/server";
import { SidebarPanel } from "@/components/SidebarPanel";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui";
import { AIChat } from "@/components/AIChat";

export default async function Home() {
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
      ],
    },
  ];

  // console.log("initialHistory", initialHistory.length);
  // console.log(
  //   "sidebarMenuItems disable:",
  //   sidebarMenuItems[0].items[0].disable
  // );

  return (
    <SidebarProvider defaultOpen={!false}>
      <SidebarPanel menuItems={sidebarMenuItems} />
      <SidebarTrigger className="sticky top-0 cursor-pointer" />
      <SidebarInset>
        <AIChat id={id} initialHistory={initialHistory} />
      </SidebarInset>
    </SidebarProvider>
  );
}
