"use server";

import { alwaysfullybooked } from "@/lib/alwaysfullybooked";
import { openscor } from "@/lib/openscor";
import { auth } from "@/server/auth";
import type { Category } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";

interface JoinRankingsProps {
	country: string;
	lang: string;
	city: string;
	venueId: string;
	competitionId: string;
	category: Category;
	playerId: string;
	playerName: string;
	playerContactMethod: string;
	playerContactId: string;
	playerEmailId: string;
	addToLeaderboard: boolean;
	addToVenue: boolean;
}

export async function joinVenueRankings({
	country,
	lang,
	city,
	venueId,
	competitionId,
	category,
	playerId,
	playerName,
	playerContactMethod,
	playerContactId,
	playerEmailId,
	addToLeaderboard,
	addToVenue,
}: JoinRankingsProps) {
	const session = await auth();

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	const venue = await alwaysfullybooked.venues.publicFind({ venueId });

	if (!venue) {
		throw new Error("Venue not found");
	}

	if (addToLeaderboard) {
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

	if (addToVenue) {
		await api.venueMembers.create({
			venueId,
			venueName: venue.name,
			venueCountry: venue.country,
			playerId,
			playerName,
			playerContactMethod,
			playerContactId,
			playerEmailId,
		});
	}

	revalidatePath(`/${country}/${lang}/${city}/venues/${venueId}`);
}
