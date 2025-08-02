"use server";

import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

import { revalidatePath } from "next/cache";

export async function createTennisPreferences({ universalTennisRating, nationalTennisRatingProgram }: { universalTennisRating: string; nationalTennisRatingProgram: string }) {
	const session = await auth();

	if (!session?.user?.id || !session.user?.email) {
		throw new Error("Unauthorized");
	}
	const result = await api.preferences.upsert({
		category: "tennis",
		universalTennisRating,
		nationalTennisRatingProgram,
	});
	revalidatePath("/profile");

	return result;
}
