import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 1. EXACT ROUTE DEFINITIONS
const TESTER_BASE = '/tester'
const MAINTAINER_BASE = '/maintainer'
const PUBLIC_ROUTES = ['/signin', '/signup', '/'] 

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 2. Read tokens directly from cookies
  const token = request.cookies.get('accessToken')?.value
  const userRole = request.cookies.get('userRole')?.value?.toLowerCase()

  // -----------------------------------------------------------
  // CHECK 1: User is NOT Logged In (Guest)
  // -----------------------------------------------------------
  if (!token) {
    // If trying to access ANY protected route, force them to Sign In
    if (pathname.startsWith(TESTER_BASE) || pathname.startsWith(MAINTAINER_BASE)) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
    // Allow guests to see public pages (Landing, Signin, Register)
    return NextResponse.next()
  }

  // -----------------------------------------------------------
  // CHECK 2: User IS Logged In (but is on a Public Page like /signin)
  // -----------------------------------------------------------
  if (PUBLIC_ROUTES.includes(pathname) && pathname !== '/') {
    
    // A. Try to redirect them back to "Where they came from"
    const referer = request.headers.get('referer')
    if (referer) {
      const refererUrl = new URL(referer)
      // Safety: Only redirect if it's the SAME site and NOT a public route (avoids loops)
      if (
        refererUrl.origin === request.nextUrl.origin && 
        !PUBLIC_ROUTES.includes(refererUrl.pathname)
      ) {
        return NextResponse.redirect(refererUrl)
      }
    }

    // B. Fallback: Send them to their Default Dashboard
    if (userRole === 'tester') {
      return NextResponse.redirect(new URL('/tester/dashboard', request.url))
    } else if (userRole === 'maintainer') {
      return NextResponse.redirect(new URL('/maintainer/dashboard', request.url))
    }
  }

  // -----------------------------------------------------------
  // CHECK 3: Role-Based Access Control (RBAC)
  // -----------------------------------------------------------
  
  // Prevent Tester from accessing Maintainer routes
  if (userRole === 'tester' && pathname.startsWith(MAINTAINER_BASE)) {
    return NextResponse.redirect(new URL('/tester/dashboard', request.url))
  }

  // Prevent Maintainer from accessing Tester routes
  if (userRole === 'maintainer' && pathname.startsWith(TESTER_BASE)) {
    return NextResponse.redirect(new URL('/maintainer/dashboard', request.url))
  }

  // Allow valid traffic
  return NextResponse.next()
}

// Optimization: Exclude static files, images, and API routes from this logic
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}