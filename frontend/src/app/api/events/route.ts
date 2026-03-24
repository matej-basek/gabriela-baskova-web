import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
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

// GET all events (public)
export async function GET() {
    try {
        await dbConnect();
        const events = await Event.find({}).sort({ date: 1 });
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ message: 'Chyba serveru' }, { status: 500 });
    }
}

// POST new event (protected)
export async function POST(request: Request) {
    try {
        if (!(await checkAuth(request))) {
            return NextResponse.json({ message: 'Neautorizováno' }, { status: 401 });
        }

        await dbConnect();
        const data = await request.json();

        const newEvent = new Event({
            title: data.title,
            description: data.description,
            date: data.date,
            imageUrl: data.imageUrl || '',
            registrationUrl: data.registrationUrl || '',
        });

        const savedEvent = await newEvent.save();
        return NextResponse.json(savedEvent, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Chyba při vytváření akce' }, { status: 500 });
    }
}
