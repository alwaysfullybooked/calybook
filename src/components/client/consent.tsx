"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function cookieConsentGiven() {
  return localStorage.getItem("cookie_consent") ?? "undecided";
}

export default function Banner() {
  const [consentGiven, setConsentGiven] = useState("");

  useEffect(() => {
    // We want this to only run once the client loads
    // or else it causes a hydration error
    setConsentGiven(cookieConsentGiven());
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookie_consent", "yes");
    setConsentGiven("yes");
  };

  const handleDeclineCookies = () => {
    localStorage.setItem("cookie_consent", "no");
    setConsentGiven("no");
  };

  return (
    <>
      {consentGiven === "undecided" && (
        <div className="fixed bottom-0 z-[100] my-6 mr-6 w-full rounded-xl border bg-card text-card-foreground duration-500 animate-in fade-in slide-in-from-bottom">
          <div className="relative my-6 max-w-screen-md mx-auto container p-6">
            <h2 className="mx-auto text-lg font-semibold">Privacy Settings</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We use cookies to provide and continually improve our services. Please accept cookies to help us improve. You may change your consent at any time with effect for the future.
            </p>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <Link href="/privacy" target="_blank" className="inline-flex items-center text-sm font-medium duration-500">
                  View Privacy Policy
                </Link>
                <Button variant="secondary" className="w-[100px] px-2 py-2" onClick={handleDeclineCookies}>
                  Deny
                </Button>
                <Button variant="default" className="w-[100px] px-2 py-2 text-black" onClick={handleAcceptCookies}>
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
