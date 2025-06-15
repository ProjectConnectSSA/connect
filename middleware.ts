// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client *within* the middleware scope
// IMPORTANT: Use environment variables directly here
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host");
  const pathname = request.nextUrl.pathname;

  // Prevent middleware from running on internal Next.js paths or API routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check if Supabase creds are available
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or Key missing in middleware, skipping custom domain check.");
    return NextResponse.next();
  }

  // Define your app's default hostname(s) - include production domain later
  const defaultHosts = ["localhost:3000", "your-production-domain.com"]; // Add your prod domain

  // If it's a default host or no hostname, let the request pass through normally
  if (!hostname || defaultHosts.includes(hostname)) {
    // console.log(`Default host or no hostname (${hostname}), skipping rewrite.`);
    return NextResponse.next();
  }

  // It's potentially a custom domain, query Supabase
  console.log(`Custom domain detected: ${hostname}. Querying Supabase...`);

  // Create a temporary client instance for this request
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from("link_forms")
      .select("slug") // Select only the slug needed for rewrite
      .eq("custom_domain", hostname)
      .maybeSingle();

    if (error) {
      console.error(`Middleware Supabase error for domain [${hostname}]:`, error.message);
      // Decide how to handle DB errors in middleware (e.g., let pass, show error page?)
      return NextResponse.next(); // Let it pass, likely results in 404 down the line
    }

    if (data && data.slug) {
      // Found a matching custom domain, rewrite to the public page route with the slug
      const rewriteUrl = new URL(`/dashboard/links/view/${data.slug}`, request.url);
      console.log(`Rewriting ${hostname}${pathname} to ${rewriteUrl.pathname}`);
      return NextResponse.rewrite(rewriteUrl);
    } else {
      // No matching custom domain found
      console.log(`No page found for custom domain: ${hostname}`);
      // Optional: Redirect to a 'domain not configured' page or just let it 404
      // Example redirect: return NextResponse.redirect(new URL('/domain-not-found', request.url));
      return NextResponse.next(); // Let it pass through to potentially 404
    }
  } catch (err) {
    console.error(`Unexpected middleware error for domain [${hostname}]:`, err);
    return NextResponse.next(); // Let request pass on unexpected errors
  }
}

// Configure the middleware to run on specific paths or all paths except assets etc.
export const config = {
  // Matcher specifies paths where middleware runs.
  // Avoid running on static assets or API routes if not needed.
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - edit (editor path - prevent rewrite loop if editor is at root)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|edit).*)", // Adjusted to exclude /edit
    "/", // Match the root path explicitly if needed
  ],
};
