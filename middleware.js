import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  
  // Strip port if localhost
  const currentHost = host.replace(/:\d+$/, '')

  // Extract subdomain
  const [subdomain] = currentHost.split('.')

  // Example routing logic
  if (subdomain === 'admin') {
    return NextResponse.rewrite(new URL('/admin', req.url))
  }

  if (subdomain === 'doctors') {
    return NextResponse.rewrite(new URL('/doctors', req.url))
  }

  if (subdomain === 'healthcenter') {
    return NextResponse.rewrite(new URL('/healthcenter', req.url))
  }

  return NextResponse.next()
}
