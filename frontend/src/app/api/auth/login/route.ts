import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'gabriela_baskova_super_secret_jwt_2024';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { username, password } = await req.json();

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ message: 'Neplatné přihlašovací údaje' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return NextResponse.json({ message: 'Neplatné přihlašovací údaje' }, { status: 401 });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
            expiresIn: '7d',
        });

        const response = NextResponse.json({ success: true });

        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Chyba serveru' }, { status: 500 });
    }
}
