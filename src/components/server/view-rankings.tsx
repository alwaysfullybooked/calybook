import Link from "next/link";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Categories, type Category } from "@/server/db/schema";
import { Trophy } from "lucide-react";

export function ViewRankings({ country, lang, city, venueId }: { country: string; lang: string; city: string; venueId: string }) {
  const categories = Object.values(Categories) as unknown as Category[];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="gap-2 bg-primary text-white w-full">
            <Trophy className="h-4 w-4" />
            Go to Rankings
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px]">
              {categories.map((cat) => (
                <li key={cat}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={`/${country}/${lang}/${city}/venues/${venueId}/${cat.toLowerCase()}`}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none capitalize">{cat}</div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
