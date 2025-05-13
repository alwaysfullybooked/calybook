"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/trpc/server";
import { auth } from "@/server/auth";

export async function updateUser({
  contactMethod,
  contactWhatsAppId,
  contactLineId,
}: {
  contactMethod: string;
  contactWhatsAppId: string;
  contactLineId: string;
}) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  await api.user.update({
    contactMethod,
    contactWhatsAppId,
    contactLineId,
  });

  revalidatePath("/settings");
}
