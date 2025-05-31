type Location = {
  name: string;
  languages: { code: string; label: string }[];
  cities: { value: string; label: string; slug: string }[];
};

export const countries = ["th", "hk", "sc", "id"];

export const locations: Record<string, Location> = {
  // be: {
  //   name: "Belgium",
  //   languages: [{ code: "en", label: "English" }],
  //   cities: [{ value: "Brussels", label: "Brussels" }],
  // },
  // fr: {
  //   name: "France",
  //   languages: [{ code: "en", label: "English" }],
  //   cities: [{ value: "Paris", label: "Paris" }],
  // },
  hk: {
    name: "Hong Kong",
    languages: [{ code: "en", label: "English" }],
    cities: [
      { value: "Hong Kong", label: "Hong Kong", slug: "hong-kong" },
      { value: "Kowloon", label: "Kowloon", slug: "kowloon" },
      { value: "New Territories", label: "New Territories", slug: "new-territories" },
    ],
  },
  id: {
    name: "Indonesia",
    languages: [{ code: "en", label: "English" }],
    cities: [
      { value: "Jakarta", label: "Jakarta", slug: "jakarta" },
      { value: "Bali", label: "Bali", slug: "bali" },
    ],
  },
  sc: {
    name: "Seychelles",
    languages: [{ code: "en", label: "English" }],
    cities: [
      { value: "Mahe", label: "Mahe", slug: "mahe" },
      { value: "Praslin", label: "Praslin", slug: "praslin" },
    ],
  },
  th: {
    name: "Thailand",
    languages: [{ code: "en", label: "English" }],
    cities: [
      // { value: "Bangkok", label: "Bangkok" },
      { value: "Chiang Mai", label: "Chiang Mai", slug: "chiang-mai" },
      { value: "Phuket", label: "Phuket", slug: "phuket" },
    ],
  },
} as const;

export function getCountryCode(country: string | null) {
  if (!country) return "";

  const countryLower = country.toLowerCase();
  const code = Object.keys(locations).find((key) => locations?.[key]?.name.toLowerCase() === countryLower);

  if (!code) return "";

  return code;
}

export function getCountry(code: string) {
  return locations[code]?.name;
}
