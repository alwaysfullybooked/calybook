import type { Metadata } from "next";

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from "@/components/ui/sidebar";
import { CalendarIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import Header from "@/components/header";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === "production" ? "https://www.calybook.com" : "http://localhost:3000"),
  title: "CalyBook",
  description: "Book all your activities.",
  openGraph: {
    title: "CalyBook",
    description: "Book all your activities.",
    url: "https://calybook.com",
    siteName: "CalyBook",
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
      <Header country="Global" link="/" />
      <SidebarProvider>
        <Sidebar className="fixed top-16 h-[calc(100vh-4rem)] border-r bg-background">
          <SidebarHeader className="border-b px-4 py-3 md:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-primary">CalyBook</span>
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
