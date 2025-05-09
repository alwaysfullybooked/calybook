// middleNextRequest, ware.js (place in the root of your project)
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get user agent from request headers
  const userAgent = request.headers.get("user-agent") || "";
  const lowerCaseUserAgent = userAgent.toLowerCase();

  // Check if it's the LINE in-app browser
  const isLine = lowerCaseUserAgent.includes("line") && !lowerCaseUserAgent.includes("chrome") && !lowerCaseUserAgent.includes("safari");

  // If it's LINE browser, add a parameter to the URL to indicate external browser should be used
  if (isLine) {
    // Create the external URL (current URL with a special parameter)
    const url = new URL(request.url);

    // Check if this is already a redirect attempt with our parameter
    if (!url.searchParams.has("external_browser")) {
      // Add a parameter to indicate we want to open in external browser
      url.searchParams.set("external_browser", "true");

      // Return response with a special header that can trigger external browser
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
