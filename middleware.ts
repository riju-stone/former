import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export async function middleware(req: NextRequest) {
  const cookies = getSessionCookie(req)
  if (!cookies) {
    return NextResponse.redirect(new URL("/", req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard", "/builder", "/preview"]
}