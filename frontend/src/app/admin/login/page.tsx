'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Loader2, Lock } from 'lucide-react';

export default function AdminLoginPage() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
                credentials: 'include',
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Chybné přihlašovací údaje');
            }
            window.location.href = '/admin/events';
        } catch (err: unknown) {
            setError((err as Error).message || 'Chybné přihlašovací údaje');
        } finally {
            setLoading(false);
        }

    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
        }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        display: 'inline-flex',
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #9b51e0, #CF2ABA)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        fontWeight: 800,
                        color: '#fff',
                        boxShadow: '0 8px 30px rgba(155,81,224,0.5)',
                        marginBottom: '16px',
                    }}>
                        GB
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                        Administrace
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                        Gabriela Bašková – CMS
                    </p>
                </div>

                {/* Login form */}
                <div className="glass" style={{ borderRadius: '28px', padding: '40px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                                Uživatelské jméno
                            </label>
                            <input
                                className="glass-input"
                                type="text"
                                placeholder="admin"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                                autoFocus
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                                Heslo
                            </label>
                            <input
                                className="glass-input"
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>

                        {error && (
                            <div style={{
                                padding: '12px 16px',
                                borderRadius: '10px',
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#fca5a5',
                                fontSize: '14px',
                            }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ marginTop: '6px', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            {loading ? <><Loader2 size={16} className="animate-spin" /> Přihlašuji...</> : <><Lock size={16} /> Přihlásit se</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
