import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isGeneralRoute = createRouteMatcher(['/app(.*)'])
const isOperadorRoute = createRouteMatcher(['/operador(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const {userId, redirectToSignIn, sessionClaims} = await auth()

  const role = sessionClaims?.metadata?.role

  //Redirect to login if not authenticated
  if(!userId){
    return redirectToSignIn({returnBackUrl: req.url})
  }

  if(req.nextUrl.pathname === '/'){
    switch (role){
      case 'general':
        return NextResponse.redirect(new URL('/app', req.url))
      case 'operador':
        return NextResponse.redirect(new URL('/operador', req.url))
      default:
        return NextResponse.rewrite(new URL('/404', req.url))
    }
  }


  // Protect all routes starting with `/general`
  if (isGeneralRoute(req) && role !== 'general') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }

  // Protect all routes starting with `/operador`
  if (isOperadorRoute(req) && role !== 'operador') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()

})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
