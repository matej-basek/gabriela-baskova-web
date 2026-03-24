'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Loader2, Calendar, Building, Globe, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (pathname === '/admin/login') {
            setChecking(false);
            return;
        }

        api.get('/api/auth/me')
            .then(() => setChecking(false))
            .catch(() => router.push('/admin/login'));
    }, [router, pathname]);

    const handleLogout = async () => {
        await api.post('/api/auth/logout');
        router.push('/admin/login');
    };

    if (checking) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
                <Loader2 size={32} color="rgba(255,255,255,0.5)" className="animate-spin" />
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>Ověřuji přihlášení...</div>
            </div>
        );
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const navItems = [
        { href: '/admin/events', label: <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> Akce</span>, title: 'Akce' },
        { href: '/admin/studios', label: <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Building size={16} /> Studia & Rozvrhy</span>, title: 'Studia' },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top bar */}
            <header className="glass admin-topbar" style={{ borderRadius: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #9b51e0, #CF2ABA)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 800,
                        color: '#fff',
                    }}>GB</div>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>Admin CMS</span>
                </div>

                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} style={{
                            padding: '7px 16px',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: 500,
                            background: pathname.startsWith(item.href) ? 'rgba(155,81,224,0.3)' : 'rgba(255,255,255,0.07)',
                            color: pathname.startsWith(item.href) ? '#fff' : 'rgba(255,255,255,0.7)',
                            border: `1px solid ${pathname.startsWith(item.href) ? 'rgba(155,81,224,0.5)' : 'rgba(255,255,255,0.1)'}`,
                            transition: 'all 0.2s',
                        }}>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="admin-actions">
                    <Link href="/" target="_blank" style={{
                        padding: '7px 16px',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: 500,
                        background: 'rgba(255,255,255,0.07)',
                        color: 'rgba(255,255,255,0.7)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s',
                    }}>
                        <Globe size={14} /> Web
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '7px 16px',
                            borderRadius: '50px',
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#fca5a5',
                            cursor: 'pointer',
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '13px',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        <LogOut size={14} /> Odhlásit
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main style={{ flex: 1, padding: '32px 24px', maxWidth: 1100, width: '100%', margin: '0 auto' }}>
                {children}
            </main>
        </div>
    );
}
