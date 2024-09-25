import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // const publicPaths = ["/", "/sign-in"];
  // if (publicPaths.includes(request.nextUrl.pathname)) {
  //   return NextResponse.next();
  // }
  // const isAuthenticated = await checkAuth();
  // if (!isAuthenticated) {
  //   return NextResponse.redirect(new URL("/sign-in", request.url));
  // }
  // // Extend the session if authenticated
  // await extendSession();
  // return NextResponse.next();
}

export const config = {
  matcher: ["/wallet/:path*"],
};
