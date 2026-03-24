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

// PUT update lesson
export async function PUT(request: Request, { params }: { params: { id: string, lessonId: string } }) {
    try {
        const { id, lessonId } = await params;

        if (!(await checkAuth(request))) {
            return NextResponse.json({ message: 'Neautorizováno' }, { status: 401 });
        }

        await dbConnect();
        const data = await request.json();

        const studio = await Studio.findOneAndUpdate(
            { _id: id, "lessons._id": lessonId },
            { $set: { "lessons.$": { _id: lessonId, ...data } } },
            { new: true }
        );

        if (!studio) {
            return NextResponse.json({ message: 'Studio nebo lekce nenalezena' }, { status: 404 });
        }

        return NextResponse.json(studio);
    } catch (error) {
        return NextResponse.json({ message: 'Chyba při úpravě lekce' }, { status: 500 });
    }
}

// DELETE lesson
export async function DELETE(request: Request, { params }: { params: { id: string, lessonId: string } }) {
    try {
        const { id, lessonId } = await params;

        if (!(await checkAuth(request))) {
            return NextResponse.json({ message: 'Neautorizováno' }, { status: 401 });
        }

        await dbConnect();

        const studio = await Studio.findByIdAndUpdate(
            id,
            { $pull: { lessons: { _id: lessonId } } },
            { new: true }
        );

        if (!studio) {
            return NextResponse.json({ message: 'Studio nenalezeno' }, { status: 404 });
        }

        return NextResponse.json(studio);
    } catch (error) {
        return NextResponse.json({ message: 'Chyba při mazání lekce' }, { status: 500 });
    }
}
