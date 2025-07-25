import { Button } from "@/components/ui/button";
import { BE, HK, ID, SC, TH, VN } from "country-flag-icons/react/3x2";
import type { Metadata } from "next";
import Link from "next/link";

import { locations } from "../../lib/locations";

// Map country codes to their flag components
const countryFlags: Record<string, React.ComponentType> = {
  be: BE,
  hk: HK,
  id: ID,
  sc: SC,
  th: TH,
  vn: VN,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.calybook.com"),
  title: "CalyBook",
  description: "Organise your activities.",
  openGraph: {
    title: "CalyBook",
    description: "Organise your activities.",
    url: "https://www.calybook.com",
    siteName: "CalyBook",
    images: [
      {
        url: "https://www.calybook.com/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@digitalcentral",
    creator: "@digitalcentral",
  },
  alternates: {
    canonical: "https://www.calybook.com",
  },
};

export default function Home() {
  return (
    <div className="bg-background py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="w-full bg-card text-card-foreground rounded-xl p-3 sm:p-6 md:p-8">
        <div className="max-w-2xl mx-auto mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2">
            Welcome to CalyBook
          </h1>
          <p className="text-center text-muted-foreground text-base sm:text-lg">
            Organising activities has never been easier.
          </p>
        </div>

        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-5 text-center">
          Available Locations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Object.entries(locations).map(([countryCode, country]) => {
            const Flag = countryFlags[countryCode];
            return (
              <div
                key={countryCode}
                className="flex flex-col gap-3 bg-muted rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2">
                  {Flag && (
                    <div className="w-7 h-5 sm:w-8 sm:h-6 rounded-sm">
                      <Flag />
                    </div>
                  )}
                  <Link href={`/${countryCode}`}>
                    <h3 className="text-base sm:text-lg font-semibold text-primary">
                      {country.name}
                    </h3>
                  </Link>
                </div>

                {"cities" in country && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1.5">
                      Cities
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {country.cities.map((city) => (
                        <Link
                          key={city.value}
                          href={`/${countryCode}/en/${city.slug}`}
                        >
                          <Button
                            variant="link"
                            size="sm"
                            className="text-xs sm:text-sm hover:scale-105 transition-transform"
                          >
                            {city.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
