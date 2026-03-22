'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (adminOnly && user.role !== 'Admin') {
                router.push('/dashboard');
            }
        }
    }, [user, loading, router, adminOnly]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    if (adminOnly && user.role !== 'Admin') {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}
