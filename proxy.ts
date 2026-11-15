import { NextResponse, type NextRequest } from "next/server";
import { getAuth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  // Auth endpoints (including the Google callback) must work before login.
  if (pathname === "/sign-in" || pathname === "/sign-up" || pathname.startsWith("/api/auth/")) return NextResponse.next();

  let authenticated = false;
  if (request.headers.has("cookie")) {
    try {
      // Validate the actual database session, including expiry and revocation.
      const session = await getAuth().api.getSession({ headers: request.headers, query: { disableCookieCache: true } });
      authenticated = Boolean(session);
    } catch {
      // Fail closed when session validation or the database is unavailable.
      return new NextResponse("Account service unavailable. Please try again shortly.", { status: 503, headers: { "Cache-Control": "no-store" } });
    }
  }
  if (!authenticated) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
    const destination = new URL("/sign-in", request.url);
    destination.searchParams.set("next", pathname + search);
    const response = NextResponse.redirect(destination);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
