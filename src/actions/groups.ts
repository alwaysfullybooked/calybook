"use server";

import { auth } from "@/server/auth";
import type { Category } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";

export async function createGroup({
  name,
  category,
  description,
}: {
  name: string;
  category: Category;
  description: string;
}) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const result = await api.groups.create({
    name,
    category,
    description,
  });

  revalidatePath("/groups");

  return result;
}

export async function updateGroup({
  id,
  name,
  category,
  description,
}: {
  id: string;
  name: string;
  category: Category;
  description: string;
}) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const result = await api.groups.update({
    id,
    name,
    category,
    description,
  });

  revalidatePath("/groups");

  return result;
}

export async function joinGroup({
  groupId,
}: {
  groupId: string;
}) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const result = await api.groups.join({
    groupId,
  });

  revalidatePath("/groups");

  return result;
}
