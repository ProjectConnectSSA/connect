import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host");
  const pathname = request.nextUrl.pathname;

  // Prevent middleware from running on internal Next.js paths
  if (pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Check if Supabase creds are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or Key missing in middleware");
    return NextResponse.next();
  }

  // Create Supabase client with SSR for auth
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  // Get user session for auth protection
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Handle custom domain logic first (before auth checks)
  const defaultHosts = ["localhost:3000", "your-production-domain.com"]; // Add your prod domain

  if (hostname && !defaultHosts.includes(hostname)) {
    // It's potentially a custom domain, query Supabase
    console.log(`Custom domain detected: ${hostname}. Querying Supabase...`);

    try {
      const { data, error } = await supabase.from("link_forms").select("slug").eq("custom_domain", hostname).maybeSingle();

      if (error) {
        console.error(`Middleware Supabase error for domain [${hostname}]:`, error.message);
        return NextResponse.next();
      }

      if (data && data.slug) {
        // Found a matching custom domain, rewrite to the public page route with the slug
        const rewriteUrl = new URL(`/dashboard/links/view/${data.slug}`, request.url);
        console.log(`Rewriting ${hostname}${pathname} to ${rewriteUrl.pathname}`);
        return NextResponse.rewrite(rewriteUrl);
      } else {
        // No matching custom domain found
        console.log(`No page found for custom domain: ${hostname}`);
        return NextResponse.next();
      }
    } catch (err) {
      console.error(`Unexpected middleware error for domain [${hostname}]:`, err);
      return NextResponse.next();
    }
  }

  // Protect API routes (except public ones)
  if (pathname.startsWith("/api/")) {
    // Skip auth for public API routes if any
    const publicApiRoutes = ["/api/public"]; // Add your public API routes here
    const isPublicApi = publicApiRoutes.some((route) => pathname.startsWith(route));

    if (!isPublicApi) {
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }

  // Authentication protection for default hosts
  // Protect dashboard routes (except public view routes)
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith("/auth/") && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - but we handle auth in middleware
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - edit (editor path - prevent rewrite loop if editor is at root)
     */
    "/((?!_next/static|_next/image|favicon.ico|edit).*)",
    "/", // Match the root path explicitly if needed
  ],
};
