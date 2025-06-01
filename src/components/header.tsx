import Link from "next/link";
import { Menu, User, Settings, LogOut, Calendar } from "lucide-react";

import { auth, signIn, signOut } from "@/server/auth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export default async function Header({ country, link }: { country: string; link: string }) {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 border-b">
        <Link href={link} className="flex items-center space-x-2">
          <span className="text-2xl sm:text-3xl font-bold text-primary">CalyBook</span>
          <span className="font-bold text-sm sm:text-base">{country && country !== "Global" ? country : ""}</span>
        </Link>

        <div className="flex items-center">
          {session?.user ? (
            <>
              {/* Desktop Menu */}
              <div className="hidden sm:flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Menu className="h-5 w-5" />
                      {session.user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/bookings">My Bookings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <form
                        action={async () => {
                          "use server";
                          await signOut({ redirectTo: "/" });
                        }}
                      >
                        <button type="submit" className="flex items-center gap-2">
                          Sign out
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="sm:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                  <SheetHeader className="space-y-4">
                    <SheetTitle className="text-left">Menu</SheetTitle>
                    <SheetDescription className="text-left">Choose your preferred sign in method</SheetDescription>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{session.user.email}</span>
                        <span className="text-xs text-muted-foreground">Signed in</span>
                      </div>
                    </div>
                  </SheetHeader>

                  <Separator className="my-4" />

                  <nav className="flex flex-col gap-2">
                    <Link href="/bookings" className="flex items-center gap-3 px-2 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                      <Calendar className="h-4 w-4" />
                      My Bookings
                    </Link>
                    <Link href="/settings" className="flex items-center gap-3 px-2 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </nav>

                  <Separator className="my-4" />

                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/" });
                    }}
                  >
                    <Button type="submit" className="flex items-center gap-3 px-2 py-2 text-sm text-destructive rounded-md hover:bg-destructive/10 transition-colors w-full">
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Button>
                  </form>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              {/* Desktop Sign In */}
              <div className="hidden sm:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Menu className="h-5 w-5" />
                      Sign In
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <form
                        action={async () => {
                          "use server";
                          await signIn("google");
                        }}
                      >
                        <Button variant="outline" type="submit">
                          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-label="Google">
                            <title>Google</title>
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            <path d="M1 1h22v22H1z" fill="none" />
                          </svg>
                          Sign in with Google
                        </Button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Sign In */}
              <Sheet>
                <SheetTrigger asChild className="sm:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px] px-3">
                  <SheetHeader className="space-y-4">
                    <SheetTitle className="text-left">Sign In</SheetTitle>
                    <SheetDescription className="text-left">Choose Google to sign in.</SheetDescription>
                  </SheetHeader>

                  <Separator className="my-4" />

                  <form
                    action={async () => {
                      "use server";
                      await signIn("google");
                    }}
                  >
                    <Button type="submit" className="flex items-center px-4 py-2 text-sm rounded-md border bg-background text-foreground w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" aria-label="Google">
                        <title>Google</title>
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        <path d="M1 1h22v22H1z" fill="none" />
                      </svg>
                      Sign in with Google
                    </Button>
                  </form>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
