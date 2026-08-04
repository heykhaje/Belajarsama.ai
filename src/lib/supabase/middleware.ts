import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT use supabase.auth.getSession() here!
  // It only relies on cookies and is not secure for server-side auth.
  const { data: { user } } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login'
  
  if (user && isAuthPage) {
    // redirect to dashboard if logged in and trying to access auth page
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Define routes that require authentication
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                           request.nextUrl.pathname.startsWith('/ai-teacher') ||
                           request.nextUrl.pathname.startsWith('/profile')

  if (!user && isProtectedRoute) {
    // redirect to home/login if not logged in and trying to access protected route
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}
