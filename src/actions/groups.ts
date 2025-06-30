"use server";

import { openscor } from "@/lib/openscor";
import { auth } from "@/server/auth";
import type { Category } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";

export async function createGroup({
  competitionId,
  name,
  category,
  description,
  city,
  country,
}: {
  competitionId: string;
  name: string;
  category: Category;
  description: string;
  city: string;
  country: string;
}) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const result = await api.groups.create({
    competitionId,
    name,
    category,
    description,
    city,
    country,
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
  competitionId,
  category,
  playerId,
  playerName,
  playerContactMethod,
  playerContactId,
  playerEmailId,
  ranking,
}: {
  groupId: string;
  competitionId: string;
  category: Category;
  playerId: string;
  playerName: string;
  playerContactMethod: string;
  playerContactId: string;
  playerEmailId: string;
  ranking: boolean;
}) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  if (!ranking) {
    await openscor.leaderboards.create({
      competitionId,
      category,
      playerId,
      playerName,
      playerContactMethod,
      playerContactId,
      playerEmailId,
    });
  }

  const result = await api.groups.addMember({
    groupId,
  });

  revalidatePath("/groups");

  return result;
}

export async function addVenueToGroup({
  groupId,
  venueId,
  venueName,
  venueCountry,
}: {
  groupId: string;
  venueId: string;
  venueName: string;
  venueCountry: string;
}) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const result = await api.groups.addVenue({
    groupId,
    venueId,
    venueName,
    venueCountry,
  });

  revalidatePath(`/groups/${groupId}`);

  return result;
}
