"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient, Role } from "@prisma/client";

import { type Message } from "@/types";
import { splitReasoningAndAnswer } from "@/utils";

const prisma = new PrismaClient();

export async function chatHistoryAction(id: string) {
  const messages = await prisma.chatMessage.findMany({
    where: {
      chatId: id,
    },
    select: {
      role: true,
      content: true,
    },
  });

  return messages.map(({ role, content }) => ({
    role,
    ...(role === Role.user
      ? { content }
      : { content: splitReasoningAndAnswer(content) }),
  })) as Message[];
}

export async function clearChatAction(id: string) {
  await prisma.chatMessage.deleteMany({
    where: {
      chatId: id,
    },
  });

  // revalidatePath("/");
}
