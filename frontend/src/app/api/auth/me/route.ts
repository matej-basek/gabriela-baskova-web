import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gabriela_baskova_super_secret_jwt_2024';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Neautorizováno' }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, username: string };

        await dbConnect();
        const user = await User.findById(decoded.id).select('-passwordHash');

        if (!user) {
            return NextResponse.json({ message: 'Uživatel nenalezen' }, { status: 401 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ message: 'Neautorizováno' }, { status: 401 });
    }
}
