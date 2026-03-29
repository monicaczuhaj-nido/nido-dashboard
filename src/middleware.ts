import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() validates the current token and triggers a refresh if the
  // access token is expired, propagating the new token via setAll above.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Proactively refresh the session so the token stays valid across requests.
    await supabase.auth.refreshSession();

    const loginTime = new Date(user.last_sign_in_at ?? 0).getTime();
    const elapsed = Date.now() - loginTime;

    if (elapsed > SESSION_DURATION_MS) {
      await supabase.auth.signOut();

      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("reason", "session_expired");

      const response = NextResponse.redirect(loginUrl);
      // Clear Supabase auth cookies
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        if (cookie.name.startsWith("sb-")) {
          response.cookies.delete(cookie.name);
        }
      });
      return response;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
