// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;
  const url = req.nextUrl.clone();

  // Block access to /profile if no token
  if (!token && url.pathname.startsWith("/profile")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/profile", "/", "/other-protected-route"],
};
