import { chatHistoryAction } from "@/server";
import { AIChat } from "@/components/AIChat";

export default async function Home() {
  const id = "1";

  const initialHistory = await chatHistoryAction(id);

  return <AIChat id={id} initialHistory={initialHistory} />;
}
