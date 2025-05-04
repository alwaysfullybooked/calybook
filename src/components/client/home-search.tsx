"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/button";
// import { Input } from "@/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function HomeSearch() {
  const [country, setCountry] = useState("thailand");
  const [city, setCity] = useState("chiang-mai");
  const [category, setCategory] = useState("*");
  // const [search, setSearch] = useState("");
  const didMount = useRef(false);

  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("country", country);
    params.set("city", city);

    if (category !== "*") params.set("category", category);
    // if (search) params.set("search", search);

    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (didMount.current) {
      handleSearch();
    } else {
      didMount.current = true;
    }
  }, [country, city, category]);

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle>Find and Book Venues</CardTitle>
        <CardDescription>Select your location and category to find available venues</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 max-w-sm">
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="thailand">Thailand</SelectItem>
          </SelectContent>
        </Select>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chiang-mai">Chiang Mai</SelectItem>
            <SelectItem value="bangkok">Bangkok</SelectItem>
            <SelectItem value="phuket">Phuket</SelectItem>
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
