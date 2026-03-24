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

// PUT (update) event (protected)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        // Awaiting params is required in newer Next.js versions
        const { id } = await params;

        if (!(await checkAuth(request))) {
            return NextResponse.json({ message: 'Neautorizováno' }, { status: 401 });
        }

        await dbConnect();
        const data = await request.json();

        const updatedEvent = await Event.findByIdAndUpdate(id, data, { new: true });
        if (!updatedEvent) {
            return NextResponse.json({ message: 'Akce nenalezena' }, { status: 404 });
        }

        return NextResponse.json(updatedEvent);
    } catch (error) {
        return NextResponse.json({ message: 'Chyba při úpravě akce' }, { status: 500 });
    }
}

// DELETE event (protected)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;

        if (!(await checkAuth(request))) {
            return NextResponse.json({ message: 'Neautorizováno' }, { status: 401 });
        }

        await dbConnect();

        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return NextResponse.json({ message: 'Akce nenalezena' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Akce smazána' });
    } catch (error) {
        return NextResponse.json({ message: 'Chyba při mazání akce' }, { status: 500 });
    }
}
