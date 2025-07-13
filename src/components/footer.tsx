import { locations } from "@/lib/locations";
import { BE, FR, HK, ID, SC, TH, VN } from "country-flag-icons/react/3x2";
import Link from "next/link";

// Map country codes to their flag components
const countryFlags: Record<string, React.ComponentType> = {
  be: BE,
  hk: HK,
  id: ID,
  sc: SC,
  th: TH,
  vn: VN,
};

export default function Footer({ country }: { country: string }) {
  return (
    <footer className="bg-white py-10 text-gray-600 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              CalyBook
            </h3>
            <p className="text-sm">
              The easiest way to organise your activities for {country}.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-gray-900">
                  Homepage
                </Link>
              </li>
              {/* <li>
                <Link href="#" className="hover:text-gray-900">
                  Find Venues
                </Link>
              </li> */}
              {/* <li>
                <Link href="#" className="hover:text-gray-900">
                  About Us
                </Link>
              </li> */}
              <li>
                <Link href="/faq" className="hover:text-gray-900">
                  FAQ
                </Link>
              </li>

              <li>
                <Link href="/terms" className="hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Connect
            </h3>

            <ul className="space-y-2 text-sm">
              {Object.entries(locations).map(([countryCode, country]) => {
                const Flag = countryFlags[countryCode];
                return (
                  <Link
                    key={countryCode}
                    href={`/${countryCode}/en`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <div className="w-5 h-4">{Flag && <Flag />}</div>
                    <span className="text-sm">{country.name}</span>
                  </Link>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()},{" "}
            <span className="font-bold">CalyBook</span>.
          </p>
          {/* <div className="my-8 p-2">
            Made with{" "}
            <Link href="https://alwaysfullybooked.com" className="font-bold" target="_blank" rel="noopener noreferrer">
              <span>AlwaysFullyBooked</span>
            </Link>
            , the booking engine platform.
          </div> */}
        </div>
      </div>
    </footer>
  );
}
