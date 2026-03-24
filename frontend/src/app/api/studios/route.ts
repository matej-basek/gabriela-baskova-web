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

// GET all studios (public)
export async function GET() {
    try {
        await dbConnect();
        const studios = await Studio.find({}).sort({ createdAt: -1 });
        return NextResponse.json(studios);
    } catch (error) {
        return NextResponse.json({ message: 'Chyba serveru' }, { status: 500 });
    }
}

// POST new studio (protected)
export async function POST(request: Request) {
    try {
        if (!(await checkAuth(request))) {
            return NextResponse.json({ message: 'Neautorizováno' }, { status: 401 });
        }

        await dbConnect();
        const data = await request.json();

        const newStudio = new Studio({
            name: data.name,
            photoUrl: data.photoUrl || '',
            lessons: data.lessons || [],
        });

        const savedStudio = await newStudio.save();
        return NextResponse.json(savedStudio, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Chyba při vytváření studia' }, { status: 500 });
    }
}
