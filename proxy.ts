import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('authToken')?.value;
    const role = request.cookies.get('userRole')?.value;
    const { pathname } = request.nextUrl;

    // Define protected routes
    const isTeacherRoute = pathname.startsWith('/teacher');
    const isStudentRoute = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/chapters') ||
        pathname.startsWith('/topics') ||
        pathname.startsWith('/sessions') ||
        pathname.startsWith('/levels') ||
        pathname.startsWith('/leaderboard') ||
        pathname.startsWith('/achievements') ||
        pathname.startsWith('/rewards') ||
        pathname.startsWith('/profile');

    // 1. Redirect unauthenticated users to login
    if (!token && (isTeacherRoute || isStudentRoute)) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // 2. Role-based redirection
    if (token && role) {
        // Students trying to access teacher pages
        if (role === 'student' && isTeacherRoute) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // Teachers trying to access student pages
        if (role === 'teacher' && isStudentRoute) {
            return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images (public images)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|images|login|register|forget-password|reset-password).*)',
    ],
};
