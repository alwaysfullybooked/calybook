import type { Metadata } from "next";

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HomeIcon, CalendarIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === "production" ? "https://not.alwaysfullybooked.com" : "http://localhost:3000"),
  title: "JustBookIt",
  description: "Book all your activities.",
  openGraph: {
    title: "JustBookIt",
    description: "Book all your activities.",
    url: "https://not.alwaysfullybooked.com",
    siteName: "JustBookIt",
  },
  twitter: {
    card: "summary_large_image",
    site: "@digitalcentral",
    creator: "@digitalcentral",
  },
};

export default async function AuthedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    redirect("/login");
  }

  return (
    <>
      <SidebarProvider>
        <Sidebar className="fixed top-16 h-[calc(100vh-4rem)] border-r bg-background">
          <SidebarHeader className="border-b px-4 py-3 md:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-green-600">JustBookIt</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-2 py-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/bookings" className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5" />
                    <span>Bookings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings" className="flex items-center gap-3">
                    <SettingsIcon className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 px-4 py-6">{children}</main>
      </SidebarProvider>
    </>
  );
}
