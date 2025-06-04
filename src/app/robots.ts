import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/bookings/*", "/profile/*", "/settings/*"],
    },
    sitemap: "https://www.calybook.com/sitemap.xml",
  };
}
