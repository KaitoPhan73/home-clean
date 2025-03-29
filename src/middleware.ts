/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const userRaw = request.cookies.get("user")?.value ?? " ";
  let user;

  try {
    user = JSON.parse(userRaw);
  } catch (error) {
    console.error("Error parsing user cookie:", error);
    user = null;
  }
  console.log("eeeeeeeeeee:", user);

  const requestHeaders = new Headers(request.headers);

  if (user?.groupId) {
    requestHeaders.set('x-group-id', user.groupId);
  }

  if (pathname === "/" || pathname === "/logout") {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (pathname === "/" || pathname === "/logout") {
    return NextResponse.next();
  }

  if (!userRaw) {
    return NextResponse.redirect(new URL("/logout", request.url));
  }

  if (user?.role === "Admin") {
    if (!pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/logout", request.url));
    }
  } else if (user?.role === "Manager") {
    if (!pathname.startsWith("/manager")) {
      return NextResponse.redirect(new URL("/logout", request.url));
    }
  } else if (user?.role === "Staff") {
    if (!pathname.startsWith("/homeplus")) {
      return NextResponse.redirect(new URL("/logout", request.url));
    }
  } else {
    return NextResponse.redirect(new URL("/logout", request.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });}

export const config = {
  matcher: [
    "/",
    "/logout",
    "/admin/:path*",
    "/manager/:path*",
    "/store/:path*",
    "/staff/:path*",
  ],
};