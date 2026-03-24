import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Studio from '@/models/Studio';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'gabriela_baskova_super_secret_jwt_2024'
);

async function checkAuth(request: Request) {
    const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return false;
    try {
        await jwtVerify(token, JWT_SECRET);
        return true;
    } catch (e) {
        return false;
    }
}

// POST new lesson to a studio
export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;

        if (!(await checkAuth(request))) {
            return NextResponse.json({ message: 'Neautorizováno' }, { status: 401 });
        }

        await dbConnect();
        const data = await request.json();

        const studio = await Studio.findById(id);
        if (!studio) {
            return NextResponse.json({ message: 'Studio nenalezeno' }, { status: 404 });
        }

        studio.lessons.push(data);
        await studio.save();

        return NextResponse.json(studio);
    } catch (error) {
        return NextResponse.json({ message: 'Chyba při ukládání lekce' }, { status: 500 });
    }
}
