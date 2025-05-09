"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";

const LINE_USER_AGENT_REGEX = /line/i;
const TELEGRAM_USER_AGENT_REGEX = /telegram/i;

type BrowserType = "line" | "telegram" | null;

export default function TelegramBrowserBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [browserType, setBrowserType] = useState<BrowserType>(null);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent.toLowerCase(); // Convert to lowercase for more reliable matching

      if (userAgent) {
        if (LINE_USER_AGENT_REGEX.test(userAgent)) {
          setBrowserType("line");
          setShowBanner(true);
        } else if (TELEGRAM_USER_AGENT_REGEX.test(userAgent)) {
          setBrowserType("telegram");
          setShowBanner(true);
        }
        setCurrentUrl(window.location.href);
      }
    }
  }, []);

  if (!showBanner) {
    return null;
  }

  return (
    <div className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">For the best experience, please open this page in your device's default browser</p>
        </div>
        <button
          onClick={() => {
            alert('To open this page in your main browser:\n\n1. Tap the menu icon (usually three dots "..." or similar)\n\n2. Select "Open in Browser" or "Open with other app".');
          }}
          type="button"
          className="px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 flex items-center gap-2"
        >
          <Info className="w-4 h-4" />
          Show Instructions
        </button>
      </div>
    </div>
  );
}
