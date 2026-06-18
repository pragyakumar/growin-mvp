import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

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
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/onboarding']
  const authRoutes = ['/login']

  // If user is not authenticated and tries to access protected routes
  if (!user && protectedRoutes.some(route => pathname.startsWith(route))) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated
  if (user) {
    // Check onboarding status for dashboard access
    if (pathname.startsWith('/dashboard')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (profile && !profile.onboarding_completed) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/onboarding'
        return NextResponse.redirect(redirectUrl)
      }
    }

    // Redirect authenticated + onboarded users away from login/onboarding
    if (authRoutes.some(route => pathname.startsWith(route))) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      const redirectUrl = request.nextUrl.clone()
      if (profile?.onboarding_completed) {
        redirectUrl.pathname = '/dashboard'
      } else {
        redirectUrl.pathname = '/onboarding'
      }
      return NextResponse.redirect(redirectUrl)
    }

    // Redirect from /onboarding if already completed
    if (pathname.startsWith('/onboarding')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (profile?.onboarding_completed) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/dashboard'
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
