import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { name, email, phone, message } = await request.json();

        // Validate basic fields
        if (!name || !email || !message) {
            return NextResponse.json({ message: 'Vyplňte všechna povinná pole' }, { status: 400 });
        }

        const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

        if (!accessKey) {
            // Development fallback if no access key provided
            console.log('--- MOCK WEB3FORMS EMAIL SENDED ---');
            console.log(`Od: ${name} (${email}, ${phone})`);
            console.log(`Zpráva:\n${message}`);
            return NextResponse.json({ message: 'Zpráva přijata (Mock mode - chybí klíč Web3Forms)' });
        }

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                access_key: accessKey,
                subject: `Nová zpráva z webu od: ${name}`,
                from_name: name,
                replyto: email, // This allows the user to click "Reply" in their email client and reply directly to the sender
                email: email, // Fallback for email field
                phone: phone || 'Neuvedeno',
                message: message,
            }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            return NextResponse.json({ message: 'Zpráva úspěšně odeslána' });
        } else {
            console.error('Web3Forms error:', result);
            return NextResponse.json({ message: 'Chyba serveru při odesílání zprávy' }, { status: 500 });
        }

    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json({ message: 'Chyba při zpracování požadavku' }, { status: 500 });
    }
}
