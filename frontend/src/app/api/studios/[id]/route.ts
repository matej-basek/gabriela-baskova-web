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

// PUT (update) studio (protected)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (!(await checkAuth(request))) {
            return NextResponse.json({ message: 'Neautorizováno' }, { status: 401 });
        }

        await dbConnect();
        const data = await request.json();

        const updatedStudio = await Studio.findByIdAndUpdate(id, data, { new: true });
        if (!updatedStudio) {
            return NextResponse.json({ message: 'Studio nenalezeno' }, { status: 404 });
        }

        return NextResponse.json(updatedStudio);
    } catch (error) {
        return NextResponse.json({ message: 'Chyba při úpravě studia' }, { status: 500 });
    }
}

// DELETE studio (protected)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (!(await checkAuth(request))) {
            return NextResponse.json({ message: 'Neautorizováno' }, { status: 401 });
        }

        await dbConnect();

        const deletedStudio = await Studio.findByIdAndDelete(id);
        if (!deletedStudio) {
            return NextResponse.json({ message: 'Studio nenalezeno' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Studio smazáno' });
    } catch (error) {
        return NextResponse.json({ message: 'Chyba při mazání studia' }, { status: 500 });
    }
}
