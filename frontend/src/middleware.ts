import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'gabriela_baskova_super_secret_jwt_2024'
);

export async function middleware(request: NextRequest) {
    // Only run middleware on /admin and /api endpoints (but ignore /api/auth)
    const { pathname } = request.nextUrl;
    const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
    const isProtectedApiRoute = pathname.startsWith('/api') &&
        !pathname.startsWith('/api/auth') &&
        !pathname.startsWith('/api/events') &&
        !pathname.startsWith('/api/studios') &&
        !pathname.startsWith('/api/seed') &&
        !pathname.startsWith('/api/contact');

    if (isAdminRoute || isProtectedApiRoute) {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            // Redirect to login if on page route
            if (isAdminRoute) {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }
            // Return 401 if on API route
            return NextResponse.json({ message: 'Neautorizováno' }, { status: 401 });
        }

        try {
            // Edge runtime requires jose instead of jsonwebtoken
            await jwtVerify(token, JWT_SECRET);
            return NextResponse.next();
        } catch (error) {
            if (isAdminRoute) {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }
            return NextResponse.json({ message: 'Neplatný token' }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/:path*'],
};
