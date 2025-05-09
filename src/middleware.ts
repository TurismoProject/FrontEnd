import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/cadastro")) {
    const pathNameArr = request.nextUrl.pathname.split("/");
    if (pathNameArr.length === 2 || pathNameArr.length === 3) {
      return NextResponse.redirect(
        new URL("/cadastro/steps/nome", request.url)
      );
    }
  }

  if (request.nextUrl.pathname.startsWith("/login")) {
    const refreshToken = request.cookies.get("refresh-token")?.value;
    if (!refreshToken) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/", request.url));
  }
}
