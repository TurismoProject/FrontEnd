import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/login")) {
    const refreshToken = request.cookies.get("refresh-token")?.value;
    if (!refreshToken) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/", request.url));
  }
}
