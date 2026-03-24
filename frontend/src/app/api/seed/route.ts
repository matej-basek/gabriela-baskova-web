import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
    // Basic protection to prevent unauthorized seeding in production
    if (process.env.NODE_ENV === 'production' && !request.url.includes('force=true')) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        await dbConnect();

        const adminExists = await User.findOne({ username: 'admin' });

        if (adminExists) {
            return NextResponse.json({ message: 'Admin uÅ¾ existuje' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin123', salt);

        const adminUser = new User({
            username: 'admin',
            passwordHash,
        });

        await adminUser.save();

        return NextResponse.json({
            message: 'Admin úÄet vytvoÅ™en',
            credentials: 'admin / admin123'
        });

    } catch (error: any) {
        console.error('Seed error:', error.message, error.stack);
        return NextResponse.json({ message: 'Chyba', error: error.message }, { status: 500 });
    }
}
