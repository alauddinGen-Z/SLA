import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/login');
            } else {
                setAuthenticated(true);
            }
            setLoading(false);
        };

        checkSession();

        // Listen for auth changes (login, logout, session refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                setAuthenticated(false);
                navigate('/login');
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                setAuthenticated(true);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return authenticated ? <>{children}</> : null;
}
