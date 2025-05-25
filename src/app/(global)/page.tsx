import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GB, HK, TH, SC, FR, BE, ID } from "country-flag-icons/react/3x2";

import { locations } from "../../data/locations";

// Map country codes to their flag components
const countryFlags: Record<string, React.ComponentType> = {
  be: BE,
  fr: FR,
  hk: HK,
  id: ID,
  sc: SC,
  th: TH,
};

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12 px-4">
      <div className="w-full max-w-2xl bg-card text-card-foreground rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome to Calybook</h1>
        <p className="text-center text-muted-foreground mb-8">Booking has never been easier.</p>
        <h2 className="text-xl font-semibold mb-4 text-center">Available Locations</h2>
        <div className="space-y-6">
          {Object.entries(locations).map(([countryCode, country]) => {
            const Flag = countryFlags[countryCode];
            return (
              <div key={countryCode} className="flex justify-between gap-4 bg-muted rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  {Flag && (
                    <div className="w-8 h-6 rounded-sm">
                      <Flag />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-primary">{country.name}</h3>
                </div>

                {"languages" in country && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Languages</h4>
                    {country.languages.map((lang) => (
                      <Link key={lang.code} href={`/${countryCode}/${lang.code}`}>
                        <Button variant="default" size="sm">
                          {lang.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}

                {"cities" in country && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Locations</h4>
                    <Button variant="ghost" size="sm">
                      {country.cities.map((city) => city.label).join(", ")}
                    </Button>
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
