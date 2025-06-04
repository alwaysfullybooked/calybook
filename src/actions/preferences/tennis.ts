"use server";

import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

import { revalidatePath } from "next/cache";

export async function createTennisPreferences({
  universalTennisRating,
}: {
  universalTennisRating: string;
}) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    throw new Error("Unauthorized");
  }
  const result = await api.tennisPreferences.update({
    universalTennisRating,
  });
  revalidatePath("/profile");

  return result;
}
