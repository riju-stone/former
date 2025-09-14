import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const session = req.cookies.get("better-auth.session_token")

  if (!session) {
    const redirectUrl = new URL("/login", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/builder/:path*", "/preview/:path*"]
}