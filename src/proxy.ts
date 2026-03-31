import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_DURATION_MS = 60 * 60 * 1000 // 1 hour

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Validates token and refreshes it if expired via setAll above.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')

  if (!user && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (user) {
    // Enforce 1-hour hard session limit based on last sign-in time.
    const loginTime = new Date(user.last_sign_in_at ?? 0).getTime()
    if (Date.now() - loginTime > SESSION_DURATION_MS) {
      await supabase.auth.signOut()

      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('reason', 'session_expired')

      const response = NextResponse.redirect(loginUrl)
      request.cookies.getAll().forEach((cookie) => {
        if (cookie.name.startsWith('sb-')) response.cookies.delete(cookie.name)
      })
      return response
    }

    // Proactively refresh token on every authenticated request.
    await supabase.auth.refreshSession()
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
