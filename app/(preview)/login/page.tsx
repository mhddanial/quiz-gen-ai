'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setError(error.message);
        else router.push('/login');
    };

    return (
        <form onSubmit={handleRegister}>
        <h1>Register</h1>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Password" />
        <button type="submit">Register</button>
        {error && <p>{error}</p>}
        </form>
    );
}
