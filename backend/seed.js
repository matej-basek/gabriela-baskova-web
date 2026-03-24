const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const User = require('./models/User');
const Studio = require('./models/Studio');
const Event = require('./models/Event');

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Admin user
    const existing = await User.findOne({ username: 'GabrielaBaskova' });
    if (!existing) {
        const passwordHash = await bcrypt.hash('GabrielaBaskova.1976', 12);
        await User.create({ username: 'GabrielaBaskova', passwordHash });
        console.log('👤 Admin user created: GabrielaBaskova / GabrielaBaskova.1976');
    } else {
        console.log('👤 Admin user already exists');
    }

    // Sample Studios
    const studioCount = await Studio.countDocuments();
    if (studioCount === 0) {
        await Studio.insertMany([
            {
                name: 'Jóga HK studio',
                photoUrl: '/images/Jóga HK sál.jpg',
                order: 0,
                lessons: [
                    {
                        name: 'Fyzio-jóga',
                        day: 'úterý',
                        time: '16:00 – 17:00',
                        pricePerLesson: '250,-',
                        courseInfo: 'kurz 10 lekcí (7.4. – 9.6.)',
                        coursePrice: '2300,-',
                        additionalInfo: '',
                    },
                    {
                        name: 'Hatha jóga',
                        day: 'čtvrtek',
                        time: '17:15 – 18:15',
                        pricePerLesson: '250,-',
                        courseInfo: 'kurz 10 lekcí (3.4. – 5.6.)',
                        coursePrice: '2300,-',
                        additionalInfo: '',
                    },
                ],
            },
            {
                name: 'Balance Fit Studio',
                photoUrl: '/images/BAlance fit studio.jpg',
                order: 1,
                lessons: [
                    {
                        name: 'Pilates',
                        day: 'pondělí',
                        time: '18:00 – 19:00',
                        pricePerLesson: '230,-',
                        courseInfo: 'kurz 8 lekcí',
                        coursePrice: '1800,-',
                        additionalInfo: '',
                    },
                ],
            },
            {
                name: 'Gočárova studio',
                photoUrl: '/images/Gočárova studio.jpg',
                order: 2,
                lessons: [
                    {
                        name: 'Jóga pro začátečníky',
                        day: 'středa',
                        time: '9:00 – 10:00',
                        pricePerLesson: '200,-',
                        courseInfo: '',
                        coursePrice: '',
                        additionalInfo: 'Lekce vhodná pro úplné začátečníky',
                    },
                ],
            },
        ]);
        console.log('🏛️ Sample studios created');
    } else {
        console.log('🏛️ Studios already exist');
    }

    // Sample Events — point to existing poster images
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
        await Event.insertMany([
            {
                title: 'Jarní jóga retreat',
                description: 'Víkendový jógový retreat v přírodě. Spojte se s přírodou a najděte svůj vnitřní klid při intenzivním jógovém víkendu plném meditace, ásán a zdravého jídla.',
                imageUrl: '/images/Poster 1.jpg',
                registrationUrl: 'https://forms.google.com',
                order: 0,
            },
            {
                title: 'Workshop: Dýchání a meditace',
                description: 'Naučte se techniky vědomého dýchání a meditace. Tento workshop je vhodný pro všechny úrovně.',
                imageUrl: '/images/Poster 2.jpg',
                registrationUrl: 'https://forms.google.com',
                order: 1,
            },
            {
                title: 'Letní jóga v parku',
                description: 'Cvičení venku na čerstvém vzduchu. Přineste si podložku a dobrou náladu!',
                imageUrl: '/images/Poster 3.jpg',
                registrationUrl: 'https://forms.google.com',
                order: 2,
            },
            {
                title: 'Fyzio-jóga speciál',
                description: 'Speciální lekce zaměřená na rehabilitaci a prevenci bolestí zad. Vhodná pro všechny věkové kategorie.',
                imageUrl: '/images/Poster 4.jpg',
                registrationUrl: 'https://forms.google.com',
                order: 3,
            },
        ]);
        console.log('📅 Sample events created');
    } else {
        console.log('📅 Events already exist');
    }

    await mongoose.disconnect();
    console.log('✅ Seed complete!');
}

seed().catch((err) => {
    console.error('❌ Seed error:', err);
    process.exit(1);
});
