import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect admin dashboard routes
  if (!pathname.startsWith('/admin/dashboard')) {
    return NextResponse.next()
  }

  // Check for verified admin cookie
  const adminToken = request.cookies.get('admin_token')?.value
  if (adminToken === 'authenticated_admin') {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mqfpiifujobarbhzivvc.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Ysymq47U45zMpDU5NCkrUw_6PtWComF',
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      return response
    }
  } catch (err) {
    console.error('Auth check error in proxy:', err)
  }

  return NextResponse.redirect(new URL('/admin/login', request.url))
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
}
