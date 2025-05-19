"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/button";
// import { Input } from "@/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// Define the location data structure
const locations = {
  Thailand: {
    name: "Thailand",
    cities: [
      { value: "Chiang Mai", label: "Chiang Mai" },
      { value: "Bangkok", label: "Bangkok" },
      { value: "Phuket", label: "Phuket" },
    ],
  },
  Seychelles: {
    name: "Seychelles",
    cities: [
      { value: "Mahe", label: "Mahe" },
      { value: "Praslin", label: "Praslin" },
    ],
  },
} as const;

export default function HomeSearch() {
  const [country, setCountry] = useState<keyof typeof locations>("Thailand");
  const [city, setCity] = useState<string>(locations.Thailand.cities[0].value);
  // const [category, setCategory] = useState("*");
  // const [search, setSearch] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  // Reset city when country changes
  useEffect(() => {
    setCity(locations[country].cities[0].value);
  }, [country]);

  // Update URL when selections change
  useEffect(() => {
    const params = new URLSearchParams();

    params.set("country", country);
    params.set("city", city);
    // if (category !== "*") params.set("category", category);
    // if (search) params.set("search", search);
    router.push(`${pathname}?${params.toString()}`);
  }, [country, city, router, pathname]);

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle>Find Venues and Book Services</CardTitle>
        <CardDescription>Select your location</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 max-w-sm">
        <Select value={country} onValueChange={(value: keyof typeof locations) => setCountry(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(locations).map(([value, { name }]) => (
              <SelectItem key={value} value={value}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={city} onValueChange={(value: string) => setCity(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            {locations[country].cities.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="*">All Categories</SelectItem>
            <SelectItem value="tennis">Tennis</SelectItem>
            <SelectItem value="golf">Golf</SelectItem>
            <SelectItem value="yoga">Yoga</SelectItem>
            <SelectItem value="pilates">Pilates</SelectItem>
          </SelectContent>
        </Select> */}

        <div className="mt-4 flex gap-2">
          {/* <Input placeholder="Search venues..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}
          {/* <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}
