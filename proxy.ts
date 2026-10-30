import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const homeFor = (role: string) =>
  role === 'owner' || role === 'team' ? '/admin' : role === 'applicant' ? '/pending' : '/app'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(list) {
          list.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname
  const go = (to: string) => {
    const r = NextResponse.redirect(new URL(to, request.url))
    response.cookies.getAll().forEach((c) => r.cookies.set(c))
    return r
  }

  const isProtected = ['/app', '/admin', '/pending', '/intake'].some((p) => path === p || path.startsWith(p + '/'))
  const isAuthPage = path === '/login' || path === '/signup'

  if (!user) return isProtected ? go('/login') : response
  if (!isProtected && !isAuthPage) return response

  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const role: string = data?.role ?? 'applicant'

  if (isAuthPage) return go(homeFor(role))
  const applicantOk = path.startsWith('/pending') || path.startsWith('/intake')
  if (role === 'applicant' && !applicantOk) return go('/pending')
  if (role !== 'applicant' && applicantOk) return go(homeFor(role))
  if (path.startsWith('/admin') && role !== 'owner' && role !== 'team') return go('/not-allowed')
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)'],
}
