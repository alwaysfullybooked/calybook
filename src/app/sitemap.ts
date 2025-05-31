import type { MetadataRoute } from "next";
import { countries } from "@/lib/locations";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.calybook.com";

  // Static routes
  const staticRoutes = ["", "/faq"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Country-specific routes
  const countryRoutes = countries.flatMap((country) => [
    {
      url: `${baseUrl}/${country}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ]);

  return [...staticRoutes, ...countryRoutes];
}
