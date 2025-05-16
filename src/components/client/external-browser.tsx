"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
    <div className="bg-amber-600 py-16 px-4 shadow-lg">
      <div className="flex flex-col items-center gap-3 mx-auto">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-center text-white">To login, please open website in your default browser, like Safari or Chrome. LINE and Telegram webview is not supported.</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button type="button" className="px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 flex items-center gap-2 bg-white text-amber-600 hover:bg-blue-50">
              <Info className="w-4 h-4" />
              Show Instructions
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>How to open in your main browser</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="flex flex-col gap-2 justify-center items-center text-left">
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Tap the menu icon (usually three dots "...")</li>
                    <li>Select "Open in Browser"</li>
                  </ol>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
