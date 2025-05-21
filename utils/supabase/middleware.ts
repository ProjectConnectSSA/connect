"use client";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Create an actionable response object that can be modified
  // (IMPORTANT: Do this once at the top)
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        // A simple cookies object with methods for get, set, and remove
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request cookies and response cookies
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            // Re-create response to apply request cookie changes
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request cookies and response cookies
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            // Re-create response to apply request cookie changes
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    });

    // Refresh session if expired - required for Server Components
    // This will automatically update the session cookies via the `set` method above if needed
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    const user = session?.user;

    // --- Route Protection Logic ---
    const { pathname } = request.nextUrl;

    // Define public paths that don't require authentication
    const publicPaths = ["/login", "/signup", "/auth/callback"]; // Add any other public paths

    // If user is not authenticated and trying to access a protected route
    if (!user && !publicPaths.some((path) => pathname.startsWith(path)) && pathname !== "/") {
      // Allow access to '/' even if not authenticated, as it might be a public landing page
      // or will be redirected later if user is authenticated.
      // Redirect to login page, preserving the intended destination
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirectedFrom", pathname); // Optional: carry original path
      return NextResponse.redirect(redirectUrl);
    }

    // If user IS authenticated and tries to access login/signup, redirect to dashboard
    if (user && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If user is authenticated and on the root path, redirect to dashboard
    // (Adjust '/dashboard' to your main authenticated route if different)
    if (user && pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If user is NOT authenticated and on the root path, let them stay (it might be a public landing page)
    // If it's meant to be protected, the earlier rule would have redirected them.

    // --- End Route Protection Logic ---

    return response; // Return the (potentially modified) response
  } catch (e) {
    // Fallback: If Supabase client creation fails (e.g., env vars missing)
    // or an unexpected error occurs, allow the request to pass through
    // but log the error.
    console.error("Middleware error:", e);
    // You might want to redirect to an error page or just let it proceed
    // without auth context.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

// --- Matcher Config ---
// Configure which paths the middleware should run on.
// Avoid running it on static assets and API routes for performance.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes, unless you want to protect them with this middleware)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
