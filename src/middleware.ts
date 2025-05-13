import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  if (pathName.startsWith("/api")) {
    return NextResponse.next();
  }

  if (pathName.startsWith("/cadastro/provedor")) {
    const pathNameArr = request.nextUrl.pathname.split("/");
    if (pathNameArr.length === 3) {
      return NextResponse.redirect(
        new URL("/cadastro/provedor/steps/nome", request.url)
      );
    }
  }

  if (pathName.startsWith("/cadastro/usuario")) {
    const pathNameArr = request.nextUrl.pathname.split("/");
    if (pathNameArr.length === 3) {
      return NextResponse.redirect(
        new URL("/cadastro/usuario/steps/nome", request.url)
      );
    }
  }

  if (pathName.startsWith("/login")) {
    const refreshToken = request.cookies.get("refresh-token")?.value;
    if (!refreshToken) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/", request.url));
  }
}
