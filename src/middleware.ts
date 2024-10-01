
import {  clerkMiddleware,createRouteMatcher } from "@clerk/nextjs/server";

const IsprotectedRoute = createRouteMatcher([
    '/',
    '/upcoming',
    '/previous',
    '/recordings',
    '/personal-room',
    '/meeting(.*)',
    // .* will match all the routes that start with /meeting
])
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware((auth,req) => {
    if(IsprotectedRoute(req)) auth().protect()
      if (!isPublicRoute(req)) {
        auth().protect()
      }
  
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};