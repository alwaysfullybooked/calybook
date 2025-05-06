"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/trpc/server";

export async function updateUser({
  contactMethod,
  contactWhatsAppId,
  contactLineId,
}: {
  contactMethod: string;
  contactWhatsAppId: string;
  contactLineId: string;
}) {
  await api.user.update({
    contactMethod,
    contactWhatsAppId,
    contactLineId,
  });

  revalidatePath("/settings");
}
