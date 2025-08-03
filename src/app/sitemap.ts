import type { MetadataRoute } from "next";
import { countries, locations } from "@/lib/locations";

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
  const countryRoutes = countries.flatMap((country) => {
    const countryData = locations[country];
    if (!countryData) return [];

    const routes = [
      {
        url: `${baseUrl}/${country}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
    ];

    // Add language routes
    for (const lang of countryData.languages) {
      routes.push({
        url: `${baseUrl}/${country}/${lang.code}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      });
    }

    // Add city routes
    for (const city of countryData.cities) {
      // Add city + language routes
      for (const lang of countryData.languages) {
        routes.push({
          url: `${baseUrl}/${country}/${lang.code}/${city.slug}`,
          lastModified: new Date(),
          changeFrequency: "daily" as const,
          priority: 0.6,
        });
      }
    }

    return routes;
  });

  return [...staticRoutes, ...countryRoutes];
}
