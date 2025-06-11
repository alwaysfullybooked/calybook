"use client";

import Link from "next/link";
import { Trophy } from "lucide-react";

export function ViewRankings({ country, lang, city, venueId }: { country: string; lang: string; city: string; venueId: string }) {
  return (
    <Link href={`/${country}/${lang}/${city}/venues/${venueId}/rankings/tennis`} className="flex items-center gap-2 bg-primary text-white p-2 rounded-md">
      <Trophy className="h-4 w-4" />
      <span>Tennis Rankings</span>
    </Link>
  );
}
