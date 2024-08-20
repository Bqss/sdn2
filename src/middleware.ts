import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  if (req.nextUrl.pathname.startsWith("/auth/login") && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }else if(!req.nextUrl.pathname.startsWith("/admin/")){
    return NextResponse.next();
  }

  const authMiddleware = withAuth({
    pages: {
      signIn: `/auth/login`,
    },
  });

  // @ts-expect-error
  return authMiddleware(req, event);
}
