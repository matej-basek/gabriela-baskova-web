import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gabriela_baskova_super_secret_jwt_2024';
const BACKEND_URL = process.env.BACKEND_URL || 'https://gb-backend-sosf.onrender.com';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        // Proxy credentials check to Express backend
        const backendRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!backendRes.ok) {
            const data = await backendRes.json().catch(() => ({}));
            return NextResponse.json(
                { message: data.message || 'Neplatné přihlašovací údaje' },
                { status: backendRes.status }
            );
        }

        const data = await backendRes.json();

        // Issue our OWN token for the Next.js middleware (set on gabrielabaskova.cz)
        const token = jwt.sign({ username: data.username }, JWT_SECRET, { expiresIn: '7d' });

        const response = NextResponse.json({ success: true });

        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error('Login proxy error:', error);
        return NextResponse.json({ message: 'Chyba serveru' }, { status: 500 });
    }
}
