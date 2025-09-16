import React, { createContext, useContext, useEffect, useState } from 'react';
import { authLogin, authLogout, authMe, authRegister } from '../api/auth';
import type { MeResponse } from '../types/types';

type AuthUser = { id: number; name: string; email: string } | null;

interface AuthCtx {
    user: AuthUser
    loading: boolean
    login: (p: { email: string; password: string }) => Promise<void>
    register: (p: { name: string; secondname: string; email: string; password: string }) => Promise<void>
    logout: () => Promise<void>
    refresh: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser>(null);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        setLoading(true);
        try {
            const me = await authMe();
            setUser(me.user);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void refresh();
    }, []);

    const login = async (p: { email: string; password: string }) => {
        await authLogin(p);
        await refresh();
    }

    const register = async (p: { name: string; secondname: string; email: string; password: string }) => {
        await authRegister(p);
        await refresh();
    }

    const logout = async () => {
        await authLogout();
        setUser(null);
    }

    return (
        <Ctx.Provider value={{ user, loading, login, register, logout, refresh }}>
            {children}
        </Ctx.Provider>
    );
}

export function useAuth() {
    const v = useContext(Ctx);
    if (!v) throw new Error('useAuth must be used within AuthProvider');
    return v;
}
