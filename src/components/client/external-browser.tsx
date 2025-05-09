// components/ExternalBrowserRedirect.js
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ExternalBrowserRedirect() {
  const searchParams = useSearchParams();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if we need to open in external browser
    if (searchParams.get("external_browser") === "true") {
      // Create clean URL without the parameter
      const url = new URL(window.location.href);
      url.searchParams.delete("external_browser");
      const cleanUrl = url.toString();

      // Try automatic redirect
      try {
        window.location.href = cleanUrl;

        // If we're still here after a short delay, show the banner
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 500);

        return () => clearTimeout(timer);
      } catch (e) {
        setShowBanner(true);
      }
    }
  }, [searchParams]);

  if (!showBanner) return null;

  // Create clean URL for the button
  const url = new URL(window.location.href);
  url.searchParams.delete("external_browser");

  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white p-4 z-50">
      <p>For the best experience, please open in your default browser</p>
      <a href={url.toString()} target="_blank" rel="noopener noreferrer" className="bg-white text-blue-500 px-4 py-2 mt-2 inline-block rounded">
        Open in Browser
      </a>
    </div>
  );
}
