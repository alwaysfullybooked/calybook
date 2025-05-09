import { NextResponse, type NextRequest } from "next/server";

// Function to check if the request is coming from an in-app browser
function isInAppBrowser(userAgent: string): boolean {
  const inAppBrowsers = [
    "Line", // Line app browser
    "WhatsApp", // WhatsApp in-app browser
    "Telegram", // Telegram in-app browser
    "WeChat", // WeChat in-app browser
  ];

  return inAppBrowsers.some((browser) => userAgent.includes(browser));
}

export default async (req: NextRequest) => {
  // Check for in-app browser
  const userAgent = req.headers.get("user-agent") || "";
  if (isInAppBrowser(userAgent)) {
    // Get the current URL
    const url = new URL(req.url);
    // Create a deep link that will open in the default browser
    const deepLink = "https://not.alwaysfullybooked.com";
    // Redirect to the deep link
    return NextResponse.redirect(deepLink);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
