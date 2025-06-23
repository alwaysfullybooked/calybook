"use client";

import { Trophy } from "lucide-react";
import Link from "next/link";

export function ViewRankings({ country, lang, city, venueId, category }: { country: string; lang: string; city: string; venueId: string; category: string }) {
  return (
    <Link href={`/${country}/${lang}/${city}/venues/${venueId}/rankings/${category}`} className="flex items-center gap-2 bg-primary text-white p-2 rounded-md">
      <Trophy className="h-4 w-4" />
      <span className="capitalize">{category} Rankings</span>
    </Link>
  );
}
